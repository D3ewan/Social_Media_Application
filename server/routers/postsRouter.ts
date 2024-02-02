import express from 'express';
const router=express.Router();
import {  createPostController, likeAndUnlikePostController, updatePostControlller, deletePostControlller } from '../controllers/postsController';
import requireUser from '../middleware/requireUser';

router.post('/', requireUser, createPostController)
router.post('/like',requireUser, likeAndUnlikePostController)
router.put('/', requireUser, updatePostControlller)
router.delete('/', requireUser, deletePostControlller);

export default router;