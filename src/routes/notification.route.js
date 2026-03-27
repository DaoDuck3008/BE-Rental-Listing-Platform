import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  index,
  unreadCount,
  updateStatus,
  markAllRead,
  destroy,
} from "../controllers/notification.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Push Alerts and User Notification Aggregation
 */

router.use(protect);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Compile list of user contextual alerts
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications stack dispatched
 */
router.get("/", index);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Quantify the number of untouched alerts
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Numeration finalized
 */
router.get("/unread-count", unreadCount);

/**
 * @swagger
 * /api/notifications/{id}/status:
 *   patch:
 *     summary: Mark a singular alert as examined
 *     tags: [Notifications]
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
 *               is_read:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mutated gracefully
 */
router.patch("/:id/status", updateStatus);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   patch:
 *     summary: Sweep marking mechanism for reading everything
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toggled global read metric
 */
router.patch("/mark-all-read", markAllRead);


/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Pluck and discard a given notification entry
 *     tags: [Notifications]
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
 *         description: Purged from tracking sequence
 */
router.delete("/:id", destroy);

export default router;
