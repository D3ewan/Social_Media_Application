const mongoose=require('mongoose');
const User=require('../model/user');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const method=require('../utils/responseWrapper');
// const {error,success}=require('../utils/responseWrapper'); not working properly

const signupController=async (req,res)=>{
    console.log('Signup Successful!!');
    const {email,password}=req.body;

    if(!email || !password){
        return;
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=new User({email,password:hashPassword});
    try{
        await user.save();
    }
    catch(error){
        return res.send(method.error(409,'User Already Exists!!! '));
        // console.log("duplicate");
    }
    // console.log(user);
    return res.send(method.success(200,user));
}

const loginController=async (req,res)=>{

    const {email,password}=req.body;

    if(!email || !password){
        return;
    }
    const user=await User.findOne({email});

    if(!user){
        // return res.status(404).send('User is not registered');
        return res.send(method.error(404,'Not Registered!! '));
    }
    
    const matched= await bcrypt.compare(password,user.password);
    
    if(!matched){
        // return res.status(404).send('Enter correct password');
        return res.send(method.error(404,'Incorrect Password!! '));
    }
    try{
        const accessToken=accessTokenGenerator({
            _id:user._id
        });
    }
    catch(error){
        console.log(error);
    }
    const accessToken=accessTokenGenerator({
        _id:user._id
    });
    const refreshToken=refreshTokenGenerator({
        _id:user._id
    })

    res.cookie('jwt',refreshToken,{
        httpOnly:true,
        secure:true
    })

    return res.send(method.success(200,accessToken));//json({user,accessToken});
}

const accessTokenRefresher=(req,res)=>{
    const cookies=req.cookies;
    if(!cookies.jwt){
        res.send(method.error(404,'refresh token in cookies required!!'));
    }
    const refreshToken=cookies.jwt;
    console.log(refreshToken);
    // const refreshToken=req.body.refreshToken;
    try {
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY);
        const _id=decoded._id;

        const accessToken=accessTokenGenerator({_id});

        // return res.status(201).send(accessToken);
        return res.send(method.success(201,accessToken));

        // next()
    } catch (error) {
        console.log(error);
        // return res.status(401).send('Invalid refresh token!!');
        return res.send(method.error(401,'Invalid refresh token!!'));
    }
}

const refreshTokenGenerator=(data)=>{
    const token=jwt.sign(data,process.env.REFRESH_TOKEN_KEY,{expiresIn:'1y'});
    return token;
}

const accessTokenGenerator=(data)=>{
    const token=jwt.sign(data,process.env.ACCESS_TOKEN_KEY,{expiresIn:'20s'});
    return token;
}

module.exports={signupController,loginController,accessTokenRefresher};