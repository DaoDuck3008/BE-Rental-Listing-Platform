import express from "express";
import {
  getAllListingTypes,
  getListingTypeById,
  createListingType,
  updateListingType,
  deleteListingType,
  searchListingTypes,
} from "../controllers/listingType.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createListingTypeSchema,
  updateListingTypeSchema,
} from "../validators/listingType.validator.js";

const router = express.Router();

// Public routes
router.get("/", getAllListingTypes);
router.get("/search", searchListingTypes);
router.get("/:id", getListingTypeById);

// Admin routes
router.post(
  "/",
  protect,
  requireRole(["ADMIN"]),
  validate(createListingTypeSchema),
  createListingType
);
router.put(
  "/:id",
  protect,
  requireRole(["ADMIN"]),
  validate(updateListingTypeSchema),
  updateListingType
);
router.delete("/:id", protect, requireRole(["ADMIN"]), deleteListingType);

export default router;
