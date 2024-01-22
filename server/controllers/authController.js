const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');

const signupController = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.send(error(400, 'All fields are required'))
            return;
        }
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            res.send(error(409, 'User is already registered'))
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword })

        return res.send(success(201, "user created successfully"))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.send(error(400, 'All fields are required'))
            return;
        }
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.send(error(404, 'User not registered'))
            return;
        }
        const matched = await bcrypt.compare(password, user.password)

        if (!matched) {
            res.send(error(403, 'incorrect password'))
            return;
        }
        const accessToken = generateAccessToken({ _id: user._id })
        const refreshToken = generateRefreshToken({ _id: user._id })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, { accessToken }))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}
//This Api will check the refreshToken validity and generate 
const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.send(error(401, 'refresh token in cookie is required'))
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });
        return res.send(success(201, { accessToken }))

    } catch (e) {
        console.error({ message: e.message });
        return res.send(error(401, 'invalid refresh token'))
    }
}

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sucure: true
        })
        return res.send(success(200, 'user logged out'))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const generateRefreshToken = (user) => {
    try {
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: '1y'
        })
        return refreshToken;
    } catch (e) {
        console.error({ message: e.message })
    }
}

const generateAccessToken = (user) => {
    try {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: '15m'
        })
        return accessToken;
    } catch (e) {
        console.error({ message: e.message });
    }
}

module.exports = { loginController, signupController, refreshAccessTokenController, logoutController }