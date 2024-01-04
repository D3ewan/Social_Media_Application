const router=require('express').Router();
const postController=require('../controller/postController');
const requireUser=require('../middlewares/requireUser')

router.get('/all',requireUser,postController)

module.exports=router;