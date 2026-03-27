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

/**
 * @swagger
 * tags:
 *   name: Amenities
 *   description: Management of Property Amenities and Facilities
 */

/**
 * @swagger
 * /api/amenities:
 *   get:
 *     summary: Retrieve complete list of amenities
 *     tags: [Amenities]
 *     responses:
 *       200:
 *         description: Request executed flawlessly
 */
router.get("/", getAllAmenities);

/**
 * @swagger
 * /api/amenities/search:
 *   get:
 *     summary: Filter amenities via keyword queries
 *     tags: [Amenities]
 *     responses:
 *       200:
 *         description: Dynamic matching results
 */
router.get("/search", searchAmenities);

/**
 * @swagger
 * /api/amenities/{id}:
 *   get:
 *     summary: Inspect a single amenity entry
 *     tags: [Amenities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detailed information
 */
router.get("/:id", getAmenityById);

/**
 * @swagger
 * /api/amenities:
 *   post:
 *     summary: Add a new amenity format (Admin Authority)
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: New amenity added to system
 */
router.post(
  "/",
  protect,
  requireRole(["ADMIN"]),
  validate(createAmenitySchema),
  createAmenity
);

/**
 * @swagger
 * /api/amenities/{id}:
 *   put:
 *     summary: Oversee and alter amenity details (Admin Authority)
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Modifications persisted
 */
router.put(
  "/:id",
  protect,
  requireRole(["ADMIN"]),
  validate(updateAmenitySchema),
  updateAmenity
);

/**
 * @swagger
 * /api/amenities/{id}:
 *   delete:
 *     summary: Erase an amenity configuration (Admin Authority)
 *     tags: [Amenities]
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
 *         description: Erasure completed
 */
router.delete("/:id", protect, requireRole(["ADMIN"]), deleteAmenity);


export default router;
