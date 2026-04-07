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
import { registerLimiter, loginLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Authentication and Authorization API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: daoduck
 *               email:
 *                 type: string
 *                 example: duc@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               role_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post("/register", registerLimiter, upload.none(), validate(registerUserSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user via Email and Password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: duc@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful (Returns user data and stores JWT token in cookie)
 */
router.post("/login", loginLimiter, upload.none(), login);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate using Google OAuth
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *               - client_id
 *             properties:
 *               credential:
 *                 type: string
 *                 description: JWT credential string from Google
 *               client_id:
 *                 type: string
 *                 description: Google Client ID
 *     responses:
 *       200:
 *         description: Google authentication successful
 */
router.post("/google", loginLimiter, upload.none(), googleLogin);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh Access Token (Requires active Refresh Token in HTTP-only Cookie)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 */
router.post("/refresh", upload.none(), refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out and cleared cookies
 */
router.post("/logout", protect, logout);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify user's email address
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify-email", upload.none(), verifyEmail);

/**
 * @swagger
 * /api/auth/resend-verify-email:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent
 */
router.post("/resend-verify-email", upload.none(), resendVerifyEmail);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully changed
 */
router.post("/change-password", protect, upload.none(), validate(changePasswordSchema), changePassword);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email has been sent
 */
router.post("/forgot-password", upload.none(), validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using verification token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", upload.none(), validate(resetPasswordSchema), resetPassword);

export default router;
