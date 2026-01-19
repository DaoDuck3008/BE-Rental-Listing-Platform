import express from "express";
import {
  getMe,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../validators/user.validator.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/profile", protect, getProfile);
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  validate(updateProfileSchema),
  updateProfile
);

export default router;
