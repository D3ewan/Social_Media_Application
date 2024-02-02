import {getUserProfileController, updateUserProfileController, followOrUnfollowUserController, getPostsOfFollowingController, getMyPostController, getUserPostsController, deleteUserProfileController, getMyInfoController } from '../controllers/userController';
import requireUser from '../middleware/requireUser';

import express from 'express';
const router=express.Router();

router.post('/follow', requireUser, followOrUnfollowUserController);
router.get('/getFeedData', requireUser, getPostsOfFollowingController);
router.get('/getMyPosts', requireUser, getMyPostController);
router.get('/getUserPosts', requireUser, getUserPostsController)
router.delete('/', requireUser, deleteUserProfileController);
router.get('/getMyInfo', requireUser, getMyInfoController);
router.put('/', requireUser, updateUserProfileController);
router.post('/getUserProfile', requireUser, getUserProfileController);

export default router;