import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  create,
  destroy,
  getOne,
  search,
  stats,
  update,
} from "../controllers/destination.controller.js";
import {
  createDestinationSchema,
  updateDestinationSchema,
} from "../validators/destination.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Target Geographical Locations/Destinations Administration (Multipart Image handling enabled)
 */

router.use(protect);
router.use(requireRole(["ADMIN"]));

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Sweep location registries (List all destinations)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valid operation execution
 */
router.get("/", search);

/**
 * @swagger
 * /api/destinations/stats:
 *   get:
 *     summary: Export summarized destination activity metrics
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metric analytics delivered
 */
router.get("/stats", stats);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Magnify data points for a single destination area
 *     tags: [Destinations]
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
 *         description: Data resolution verified
 */
router.get("/:id", getOne);


/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Integrate a newly established location schema (Expects Form-Data w/ Image)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Destination plotted
 */
router.post("/", upload.none(), validate(createDestinationSchema), create);


/**
 * @swagger
 * /api/destinations/{id}:
 *   patch:
 *     summary: Refine geographic properties 
 *     tags: [Destinations]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refresh succeeded
 */
router.patch(
  "/:id",
  upload.none(),
  validate(updateDestinationSchema),
  update
);

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Vanquish a designated region footprint
 *     tags: [Destinations]
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
 *         description: Eliminated 
 */
router.delete("/:id", destroy);

export default router;
