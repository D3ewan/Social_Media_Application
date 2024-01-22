const { loginController, signupController, refreshAccessTokenController, logoutController } = require("../controllers/authController");


const router = require("express").Router();

router.post('/login', loginController)
router.post('/signup', signupController)
router.get('/refresh', refreshAccessTokenController)
router.post('/logout', logoutController)

module.exports = router