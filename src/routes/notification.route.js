import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  index,
  unreadCount,
  updateStatus,
  markAllRead,
  destroy,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", index);
router.get("/unread-count", unreadCount);
router.patch("/:id/status", updateStatus);
router.patch("/mark-all-read", markAllRead);
router.delete("/:id", destroy);

export default router;
