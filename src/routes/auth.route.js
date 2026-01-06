import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);
router.post("/refresh", upload.none(), refresh);
router.post("/logout", protect, logout);

export default router;
