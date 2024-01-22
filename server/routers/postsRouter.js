const router = require('express').Router();
const { getAllPostsController, createPostController, likeAndUnlikePostController, updatePostControlller, deletePostControlller } = require('../controllers/postsController');
const requireUser = require('../middleware/requireUser')

router.post('/', requireUser, createPostController)
router.post('/like',requireUser, likeAndUnlikePostController)
router.put('/', requireUser, updatePostControlller)
router.delete('/', requireUser, deletePostControlller);

module.exports = router