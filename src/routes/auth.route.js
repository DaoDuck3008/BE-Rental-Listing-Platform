import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register", upload.none(), register);
router.post("/login", login);

export default router;
