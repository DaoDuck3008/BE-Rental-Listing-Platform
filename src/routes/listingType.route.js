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

/**
 * @swagger
 * tags:
 *   name: ListingTypes
 *   description: Administration of available Property Classification Types
 */

/**
 * @swagger
 * /api/listing-types:
 *   get:
 *     summary: Obtain the aggregate log of all classified property setups
 *     tags: [ListingTypes]
 *     responses:
 *       200:
 *         description: Successfully fetched structural typologies
 */
router.get("/", getAllListingTypes);

/**
 * @swagger
 * /api/listing-types/search:
 *   get:
 *     summary: Perform a keyword query over the classification variants
 *     tags: [ListingTypes]
 *     responses:
 *       200:
 *         description: Echoes matching fragments
 */
router.get("/search", searchListingTypes);

/**
 * @swagger
 * /api/listing-types/{id}:
 *   get:
 *     summary: Identify the blueprint details of a solitary property type
 *     tags: [ListingTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layout retrieved 
 */
router.get("/:id", getListingTypeById);

/**
 * @swagger
 * /api/listing-types:
 *   post:
 *     summary: Initiate construction of an unused listing type (Admin Access)
 *     tags: [ListingTypes]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category injected successfully
 */
router.post(
  "/",
  protect,
  requireRole(["ADMIN"]),
  validate(createListingTypeSchema),
  createListingType
);

/**
 * @swagger
 * /api/listing-types/{id}:
 *   put:
 *     summary: Tweak the context of an established classification (Admin Access)
 *     tags: [ListingTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Remodeled flawlessly
 */
router.put(
  "/:id",
  protect,
  requireRole(["ADMIN"]),
  validate(updateListingTypeSchema),
  updateListingType
);

/**
 * @swagger
 * /api/listing-types/{id}:
 *   delete:
 *     summary: Outcast a listing category entirely (Admin Access)
 *     tags: [ListingTypes]
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
 *         description: Safely discarded
 */
router.delete("/:id", protect, requireRole(["ADMIN"]), deleteListingType);

export default router;
