import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  searchRoles,
} from "../controllers/role.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { roleSchema, updateRoleSchema } from "../validators/role.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: System Roles and Permissions Configuration (Admin Access)
 */

router.use(protect);
router.use(requireRole(["ADMIN"]));

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Fetch all registered roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles loaded successfully
 */
router.get("/", getAllRoles);

/**
 * @swagger
 * /api/roles/search:
 *   get:
 *     summary: Query specific role via keywords
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search response
 */
router.get("/search", searchRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Identify a single role configuration
 *     tags: [Roles]
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
 *         description: Details retrieved
 */
router.get("/:id", getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Introduce a new access role
 *     tags: [Roles]
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
 *     responses:
 *       201:
 *         description: Role generated securely
 */
router.post("/", validate(roleSchema), createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role classification details
 *     tags: [Roles]
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
 *     responses:
 *       200:
 *         description: Alteration finished
 */
router.put("/:id", validate(updateRoleSchema), updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Terminate and delete a specified role
 *     tags: [Roles]
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
 *         description: Destructed effectively
 */
router.delete("/:id", deleteRole);

export default router;
