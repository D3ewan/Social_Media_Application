import { loginController, signupController, refreshAccessTokenController, logoutController } from "../controllers/authController";
import express from "express";
const router=express.Router();

router.post('/login', loginController)
router.post('/signup', signupController)
router.get('/refresh', refreshAccessTokenController)
router.post('/logout', logoutController)

export default router;