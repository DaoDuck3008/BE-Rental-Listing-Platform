import express from "express";
import {
  getFavorites,
  getMe,
  getProfile,
  updateProfile,
  getUserDashboardData,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { fillProfileSchema, updateProfileSchema } from "../validators/user.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manage User Profiles and Account Data
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retrieve current authenticated user's basic info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information retrieved successfully
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve detailed profile of the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed personal profile
 */
router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update personal profile (Supports Avatar upload)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  validate(fillProfileSchema),
  updateProfile
);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get user's saved/favorited listings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite listings returns successfully
 */
router.get("/favorites", protect, getFavorites);

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     summary: Fetch Host/User dashboard statistical data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get("/dashboard", protect, getUserDashboardData);

export default router;
