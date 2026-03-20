import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  googleLogin,
  verifyEmail,
  resendVerifyEmail,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/user.validator.js";

const router = express.Router();

router.post("/register", upload.none(), validate(registerUserSchema), register);
router.post("/login", upload.none(), login);
router.post("/google", upload.none(), googleLogin);
router.post("/refresh", upload.none(), refresh);
router.post("/logout", protect, logout);
router.post("/verify-email", upload.none(), verifyEmail);
router.post("/resend-verify-email", upload.none(), resendVerifyEmail);
router.post("/change-password", protect, upload.none(), validate(changePasswordSchema), changePassword);
router.post("/forgot-password", upload.none(), validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", upload.none(), validate(resetPasswordSchema), resetPassword);

export default router;
