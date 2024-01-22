const {getUserProfileController, updateUserProfileController, followOrUnfollowUserController, getPostsOfFollowingController, getMyPostController, getUserPostsController, deleteUserProfileController, getMyInfoController } = require('../controllers/userController');
const requireUser = require('../middleware/requireUser');

const router = require('express').Router();

router.post('/follow', requireUser, followOrUnfollowUserController);
router.get('/getFeedData', requireUser, getPostsOfFollowingController);
router.get('/getMyPosts', requireUser, getMyPostController);
router.get('/getUserPosts', requireUser, getUserPostsController)
router.delete('/', requireUser, deleteUserProfileController);
router.get('/getMyInfo', requireUser, getMyInfoController);
router.put('/', requireUser, updateUserProfileController);
router.post('/getUserProfile', requireUser, getUserProfileController);

module.exports = router;