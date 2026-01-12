import express from "express";
import {
  getMe,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", getMe);
router.get("/profile", getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
