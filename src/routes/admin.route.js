import express from "express";
import {
  approveListing,
  rejectListing,
  approveEditDraft,
  rejectEditDraft,
  hardDeleteListing,
  getAllListingsForAdmin,
  getAllModeratedListingsForAdmin,
  getListingForAdmin,
} from "../controllers/admin.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(requireRole(["ADMIN"]));

router.get("/listings", getAllListingsForAdmin);
router.get("/listings/moderation", getAllModeratedListingsForAdmin);
router.get("/listings/:id", getListingForAdmin);

router.post("/listings/:id/approve", approveListing);
router.post("/listings/:id/reject", rejectListing);

router.post("/edit-drafts/:id/approve", approveEditDraft);
router.post("/edit-drafts/:id/reject", rejectEditDraft);

router.delete("/listings/:id/hard", hardDeleteListing);

export default router;
