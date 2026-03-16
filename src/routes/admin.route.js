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
  getListingStatsForAdmin,
  updateListingByAdmin,
  getAuditLogsForAdmin,
  getAuditLogByIdForAdmin,
} from "../controllers/admin.controller.js";

import {
  getOverviewStatsForAdmin,
  getGrowthChartsForAdmin,
  getListingPieChartForAdmin,
  getRecentListsForAdmin,
} from "../controllers/dashboard.controller.js";

import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect);
router.use(requireRole(["ADMIN"]));

router.get("/dashboard/overview", getOverviewStatsForAdmin);
router.get("/dashboard/charts", getGrowthChartsForAdmin);
router.get("/dashboard/pie-chart", getListingPieChartForAdmin);
router.get("/dashboard/recent", getRecentListsForAdmin);

router.get("/listings/stats", getListingStatsForAdmin);
router.get("/listings", getAllListingsForAdmin);
router.get("/listings/moderation", getAllModeratedListingsForAdmin);
router.get("/listings/:id", getListingForAdmin);

router.get("/audit-logs", getAuditLogsForAdmin);
router.get("/audit-logs/:id", getAuditLogByIdForAdmin);

router.patch("/listings/:id", upload.array("files", 15), updateListingByAdmin);

router.post("/listings/:id/approve", approveListing);
router.post("/listings/:id/reject", rejectListing);

router.post("/edit-drafts/:id/approve", approveEditDraft);
router.post("/edit-drafts/:id/reject", rejectEditDraft);

router.delete("/listings/:id/hard", hardDeleteListing);

export default router;
