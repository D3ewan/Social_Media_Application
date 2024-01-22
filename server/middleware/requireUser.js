const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.send(error(401,'Authorization header is required'))
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY)
        req._id=decoded._id;
        
        const user = await User.findById(req._id);
        if (!user) {
            return res.send(error(404,'user not found'));
        }
        next();
    } catch (e) {
        console.error({message: e.message});
        return res.send(error(401,'invalid access key'))
    }
}


