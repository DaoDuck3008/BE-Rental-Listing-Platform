import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  create,
  index,
  messages,
  send,
  markRead,
  destroy,
  updateMsg,
  deleteMsg,
} from "../controllers/chat.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Real-time Messaging and Conversation Tracking
 */

router.use(protect);

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Initiate a chat session or fetch prior communication instance
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiver_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Thread instantiated or located
 */
router.post("/", create);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Overview of all chat rooms tied to the user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dialog logs mapped
 */
router.get("/", index);

/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Dismiss an active chat window/session
 *     tags: [Chats]
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
 *         description: Deletion confirmed
 */
router.delete("/:id", destroy);

/**
 * @swagger
 * /api/chats/{id}/messages:
 *   get:
 *     summary: Load chronologically sorted conversational text
 *     tags: [Chats]
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
 *         description: Chat history exported
 */
router.get("/:id/messages", messages);

/**
 * @swagger
 * /api/chats/{id}/messages:
 *   post:
 *     summary: Transfer text message context into active session
 *     tags: [Chats]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dispatched effectively
 */
router.post("/:id/messages", send);

/**
 * @swagger
 * /api/chats/messages/{id}/read:
 *   patch:
 *     summary: Tag an individual message block as 'Read/Seen'
 *     tags: [Chats]
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
 *         description: Visibility altered successfully
 */
router.patch("/messages/:id/read", markRead);

/**
 * @swagger
 * /api/chats/messages/{id}:
 *   patch:
 *     summary: Amend message content string
 *     tags: [Chats]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payload replaced
 */
router.patch("/messages/:id", updateMsg);

/**
 * @swagger
 * /api/chats/messages/{id}:
 *   delete:
 *     summary: Obliterate specific text blob
 *     tags: [Chats]
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
 *         description: Scrapped properly
 */
router.delete("/messages/:id", deleteMsg);

export default router;
