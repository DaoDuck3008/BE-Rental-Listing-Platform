import express from "express";
import {
  approveListing,
  rejectListing,
  approveEditDraft,
  rejectEditDraft,
  hardDeleteListing,
} from "../controllers/admin.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Middleware áp dụng cho tất cả các route bên dưới
router.use(protect);
router.use(requireRole(["ADMIN"]));

// Route cho bài viết mới (PENDING)
router.post("/listings/:id/approve", approveListing);
router.post("/listings/:id/reject", rejectListing);

// Route cho bản thảo chỉnh sửa (EDIT_DRAFT)
router.post("/edit-drafts/:id/approve", approveEditDraft);
router.post("/edit-drafts/:id/reject", rejectEditDraft);

router.delete("/listings/:id/hard", hardDeleteListing);

export default router;
