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
  getAllUsersForAdmin,
  getUserStatsForAdmin,
  toggleUserActiveForAdmin,
  updateUserRoleForAdmin,
  getUserDetailForAdmin,
} from "../controllers/user.controller.js";

import {
  getOverviewStatsForAdmin,
  getGrowthChartsForAdmin,
  getListingPieChartForAdmin,
  getRecentListsForAdmin,
} from "../controllers/dashboard.controller.js";

import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrator Actions and System Moderation
 */

router.use(protect);
router.use(requireRole(["ADMIN"]));

/**
 * @swagger
 * /api/admin/dashboard/overview:
 *   get:
 *     summary: Get overall dashboard statistics overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 */
router.get("/dashboard/overview", getOverviewStatsForAdmin);

/**
 * @swagger
 * /api/admin/dashboard/charts:
 *   get:
 *     summary: Fetch data for growth charts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/dashboard/charts", getGrowthChartsForAdmin);

/**
 * @swagger
 * /api/admin/dashboard/pie-chart:
 *   get:
 *     summary: Retrieve Listing category pie chart data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/dashboard/pie-chart", getListingPieChartForAdmin);

/**
 * @swagger
 * /api/admin/dashboard/recent:
 *   get:
 *     summary: Fetch recently uploaded listings or logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 */
router.get("/dashboard/recent", getRecentListsForAdmin);

/**
 * @swagger
 * /api/admin/listings/stats:
 *   get:
 *     summary: Retrieve aggregate statistics for all listings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/listings/stats", getListingStatsForAdmin);

/**
 * @swagger
 * /api/admin/listings:
 *   get:
 *     summary: Fetch all listings regardless of status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/listings", getAllListingsForAdmin);

/**
 * @swagger
 * /api/admin/listings/moderation:
 *   get:
 *     summary: Fetch all listings pending review/moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/listings/moderation", getAllModeratedListingsForAdmin);

/**
 * @swagger
 * /api/admin/listings/{id}:
 *   get:
 *     summary: Retrieve detailed data of a single listing (including hidden details)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/listings/:id", getListingForAdmin);

/**
 * @swagger
 * /api/admin/users/stats:
 *   get:
 *     summary: Retrieve user growth and status statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/users/stats", getUserStatsForAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Fetch the complete list of system users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/users", getAllUsersForAdmin);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Fetch specific user's details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/users/:id", getUserDetailForAdmin);

/**
 * @swagger
 * /api/admin/audit-logs:
 *   get:
 *     summary: Fetch system audit logs (activity tracking)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/audit-logs", getAuditLogsForAdmin);

/**
 * @swagger
 * /api/admin/audit-logs/{id}:
 *   get:
 *     summary: Fetch specific audit log by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved data 
 */
router.get("/audit-logs/:id", getAuditLogByIdForAdmin);

/**
 * @swagger
 * /api/admin/listings/{id}:
 *   patch:
 *     summary: Force update a listing's contents (Admin Override)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Override update successful
 */
router.patch("/listings/:id", upload.array("files", 15), updateListingByAdmin);

/**
 * @swagger
 * /api/admin/users/{id}/toggle-active:
 *   patch:
 *     summary: Toggle User Ban/Active status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User status toggled
 */
router.patch("/users/:id/toggle-active", toggleUserActiveForAdmin);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Modify User Role/Permissions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User role updated 
 */
router.patch("/users/:id/role", updateUserRoleForAdmin);

/**
 * @swagger
 * /api/admin/listings/{id}/approve:
 *   post:
 *     summary: Approve a pending listing
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listing approved and published
 */
router.post("/listings/:id/approve", approveListing);

/**
 * @swagger
 * /api/admin/listings/{id}/reject:
 *   post:
 *     summary: Reject a pending listing
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listing rejected
 */
router.post("/listings/:id/reject", rejectListing);

/**
 * @swagger
 * /api/admin/edit-drafts/{id}/approve:
 *   post:
 *     summary: Approve a pending update draft for a live listing
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Draft approved and applied 
 */
router.post("/edit-drafts/:id/approve", approveEditDraft);

/**
 * @swagger
 * /api/admin/edit-drafts/{id}/reject:
 *   post:
 *     summary: Reject a pending update draft for a live listing
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Draft rejected 
 */
router.post("/edit-drafts/:id/reject", rejectEditDraft);

/**
 * @swagger
 * /api/admin/listings/{id}/hard:
 *   delete:
 *     summary: Permanently delete (hard delete) a listing
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Completely destroyed records 
 */
router.delete("/listings/:id/hard", hardDeleteListing);

export default router;
