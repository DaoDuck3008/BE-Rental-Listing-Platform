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
  submitEditDraftListing,
  updateDraftListing,
  updatePendingListing,
  updatePublisedListing,
  getMyListingById,
} from "../controllers/listing.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDraftListingSchema,
  createListingSchema,
} from "../validators/listing.validator.js";

const router = express.Router();

router.get("/listing_types", getAllListingTypes);
router.get("/my-listings", protect, requireRole(["LANDLORD"]), getMyListings);
router.get(
  "/my-listings/:id",
  protect,
  requireRole(["LANDLORD"]),
  getMyListingById
);
router.get("/:id", getPublishedListingById);

router.post(
  "/create",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(createListingSchema),
  createListing
);
router.post(
  "/draft",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(createDraftListingSchema),
  createDraftListing
);

router.patch("/:id/pending", updatePendingListing);
router.patch("/:id/publised", updatePublisedListing);
router.patch(
  "/:id/draft",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(createDraftListingSchema),
  updateDraftListing
);
router.patch(
  "/:id/edit-draft",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(createDraftListingSchema),
  updateDraftListing
);
router.post(
  "/:id/submit",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  // validate(createListingSchema),
  submitDraftListing
);
router.post("/:id/hide", hideListing);
router.post("/:id/show", showListing);
router.post("/:id/edit-draft", updateDraftListing);
router.post("/:id/edit-draft/submit", submitEditDraftListing);
router.post("/:id/renew", renewListing);
router.delete("/:id", protect, requireRole(["LANDLORD"]), softDeleteListing);

export default router;
