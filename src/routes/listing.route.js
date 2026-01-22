import express from "express";
import {
  createListing,
  getAllListingTypes,
} from "../controllers/listing.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createListingSchema } from "../validators/listing.validator.js";

const router = express.Router();

router.get("/listing_types", getAllListingTypes);
router.post(
  "/create",
  protect,
  requireRole(["LANDLORD"]),
  upload.array("files", 15),
  validate(createListingSchema),
  createListing
);

export default router;
