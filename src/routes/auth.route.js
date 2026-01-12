import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  googleLogin,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema } from "../validators/user.validator.js";

const router = express.Router();

router.post("/register", upload.none(), validate(registerUserSchema), register);
router.post("/login", upload.none(), login);
router.post("/google", upload.none(), googleLogin);
router.post("/refresh", upload.none(), refresh);
router.post("/logout", protect, logout);

export default router;
