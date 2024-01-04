const jwt=require('jsonwebtoken');

module.exports=async (req,res,next)=>{
    console.log('middlewares!! ');
    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return res.status(401).send('Authorization header is required!!');
    }
    const accessToken=req.headers.authorization.split(' ')[1];
    console.log(accessToken);

    try {
        const decoded=await jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY);
        req._id=decoded._id;
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).send('Invalid access token!!');
    }
    // next();
}