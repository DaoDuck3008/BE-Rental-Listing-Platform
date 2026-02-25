import express from "express";
import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  searchAmenities,
} from "../controllers/amenities.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createAmenitySchema,
  updateAmenitySchema,
} from "../validators/amenity.validator.js";

const router = express.Router();


// Public routes
router.get("/", getAllAmenities);
router.get("/search", searchAmenities);
router.get("/:id", getAmenityById);

// Admin routes
router.post(
  "/",
  protect,
  requireRole(["ADMIN"]),
  validate(createAmenitySchema),
  createAmenity
);
router.put(
  "/:id",
  protect,
  requireRole(["ADMIN"]),
  validate(updateAmenitySchema),
  updateAmenity
);
router.delete("/:id", protect, requireRole(["ADMIN"]), deleteAmenity);


export default router;

