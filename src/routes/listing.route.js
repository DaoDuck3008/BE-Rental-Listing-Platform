import express from "express";
import {
  createDraftListing,
  createListing,
  getAllListingTypes,
  getPublishedListingById,
  getMyListings,
  hideListing,
  renewListing,
  showListing,
  softDeleteListing,
  submitDraftListing,
  updateDraftListing,
  updateSoftPublisedListing,
  getMyListingById,
  updateHardPublishedListing,
  getAllPublishedListings,
  favoriteListing,
  getNearbyDestinationsListing,
  getRelatedListingsController,
} from "../controllers/listing.controller.js";
import {
  protect,
  optionalProtect,
  requireRole,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDraftListingSchema,
  createListingSchema,
  updateSoftListingSchema,
  updateHardListingSchema,
} from "../validators/listing.validator.js";
import { listingCreationLimiter, otherLimiter, searchLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: Property Listings Management (Supports extensive Multipart form-data for uploads)
 */

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Retrieve a public directory of all active listings
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: Returning array of published properties
 */
router.get("/", getAllPublishedListings);

/**
 * @swagger
 * /api/listings/listing_types:
 *   get:
 *     summary: Fetch available real estate property types
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: Target types loaded
 */
router.get("/listing_types", getAllListingTypes);

/**
 * @swagger
 * /api/listings/my-listings:
 *   get:
 *     summary: Get all listings managed by the logged-in Host/Landlord
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returns host's portfolio
 */
router.get(
  "/my-listings",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  getMyListings
);

/**
 * @swagger
 * /api/listings/my-listings/{id}:
 *   get:
 *     summary: Retrieve private details for one of the host's listings
 *     tags: [Listings]
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
 *         description: Specific listing info
 */
router.get(
  "/my-listings/:id",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  getMyListingById
);

/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     summary: View detailed information of a public listing (Customer view)
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Populated property representation
 */
router.get("/:id", optionalProtect, getPublishedListingById);

/**
 * @swagger
 * /api/listings/{id}/nearby-destinations:
 *   get:
 *     summary: Find nearby destinations around a specific property
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Close proximity locations
 */
router.get("/:id/nearby-destinations", getNearbyDestinationsListing);

/**
 * @swagger
 * /api/listings/{id}/related:
 *   get:
 *     summary: Generate similar recommended properties for this listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of related alternative properties
 */
router.get("/:id/related", getRelatedListingsController);

/**
 * @swagger
 * /api/listings/create:
 *   post:
 *     summary: Direct publishing procedure for a new property listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Request submitted. Status set to Pending Moderation
 */
router.post(
  "/create",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  listingCreationLimiter,
  upload.array("files", 15),
  validate(createListingSchema),
  createListing
);

/**
 * @swagger
 * /api/listings/draft:
 *   post:
 *     summary: Save listing creation progress as a Draft
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Initial Draft successfully created
 */
router.post(
  "/draft",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  upload.array("files", 15),
  validate(createDraftListingSchema),
  createDraftListing
);

/**
 * @swagger
 * /api/listings/{id}/update-soft:
 *   patch:
 *     summary: Soft Update minor details on an active property (Bypasses Admin Moderation)
 *     tags: [Listings]
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
 *         description: Successfully mutated
 */
router.patch(
  "/:id/update-soft",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  upload.array("files", 15),
  validate(updateSoftListingSchema),
  updateSoftPublisedListing
);

/**
 * @swagger
 * /api/listings/{id}/update-hard:
 *   patch:
 *     summary: Hard Update major fields. Enforces the creation of a temporary draft for moderation.
 *     tags: [Listings]
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
 *         description: Shadow Draft initialized. Awaiting confirmation
 */
router.patch(
  "/:id/update-hard",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  upload.array("files", 15),
  validate(updateHardListingSchema),
  updateHardPublishedListing
);

/**
 * @swagger
 * /api/listings/{id}/draft:
 *   patch:
 *     summary: Push modifications to an existing offline Draft
 *     tags: [Listings]
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
 *         description: Offline Draft sync completed
 */
router.patch(
  "/:id/draft",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  upload.array("files", 15),
  validate(createDraftListingSchema),
  updateDraftListing
);

/**
 * @swagger
 * /api/listings/{id}/edit-draft:
 *   patch:
 *     summary: Modify a currently pending revision for an already live Listing
 *     tags: [Listings]
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
 *         description: Pending Edit Draft updated
 */
router.patch(
  "/:id/edit-draft",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  upload.array("files", 15),
  validate(createDraftListingSchema),
  updateDraftListing
);

/**
 * @swagger
 * /api/listings/{id}/submit:
 *   post:
 *     summary: Transfer an offline Draft into the Pending Moderation queue
 *     tags: [Listings]
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
 *         description: Sent to moderators
 */
router.post(
  "/:id/submit",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  listingCreationLimiter,
  upload.array("files", 15),
  validate(createListingSchema),
  submitDraftListing
);

/**
 * @swagger
 * /api/listings/{id}/hide:
 *   post:
 *     summary: Temporarily disable (Hide) listing from public platform
 *     tags: [Listings]
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
 *         description: Visibility altered
 */
router.post(
  "/:id/hide",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  hideListing
);

/**
 * @swagger
 * /api/listings/{id}/show:
 *   post:
 *     summary: Restore visibility for a previously hidden property
 *     tags: [Listings]
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
 *         description: Now accessible to the public
 */
router.post(
  "/:id/show",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  showListing
);

/**
 * @swagger
 * /api/listings/{id}/renew:
 *   post:
 *     summary: Refresh timestamp (Renew) to push property back up the search results
 *     tags: [Listings]
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
 *         description: Placed on top
 */
router.post(
  "/:id/renew",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  renewListing
);

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     summary: Discard property and move to Trash bin (Soft Delete)
 *     tags: [Listings]
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
 *         description: Deleted gracefully
 */
router.delete(
  "/:id",
  protect,
  requireRole(["LANDLORD", "ADMIN"]),
  softDeleteListing
);

/**
 * @swagger
 * /api/listings/{id}/favorite:
 *   post:
 *     summary: Toggle (Like/Unlike) adding listing to personal favorites
 *     tags: [Listings]
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
 *         description: Boolean favorite state toggled
 */
router.post("/:id/favorite", protect, favoriteListing);

export default router;
