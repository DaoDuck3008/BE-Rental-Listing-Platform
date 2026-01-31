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
} from "../controllers/listing.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDraftListingSchema,
  createListingSchema,
  updateSoftListingSchema,
  updateHardListingSchema,
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

router.patch(
  "/:id/update-soft",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(updateSoftListingSchema),
  updateSoftPublisedListing
);
router.patch(
  "/:id/update-hard",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(updateHardListingSchema),
  updateHardPublishedListing
);
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
router.post("/:id/hide", protect, requireRole(["LANDLORD"]), hideListing);
router.post("/:id/show", protect, requireRole(["LANDLORD"]), showListing);
router.post("/:id/renew", protect, requireRole(["LANDLORD"]), renewListing);
router.delete("/:id", protect, requireRole(["LANDLORD"]), softDeleteListing);

export default router;
