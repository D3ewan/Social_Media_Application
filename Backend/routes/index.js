const router=require('express').Router();
const authRouter=require('./auth');
const postRouter=require('./post');

router.use('/auth',authRouter);
router.use('/post',postRouter);


module.exports=router;