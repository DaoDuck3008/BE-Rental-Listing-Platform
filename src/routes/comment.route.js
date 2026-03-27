import express from "express";
import { optionalProtect, protect } from "../middlewares/auth.middleware.js";
import {
  create,
  destroy,
  getReplies,
  index,
  like,
  update,
} from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Community Feedback, Reviews, and Comment Tracking
 */

/**
 * @swagger
 * /api/comments/listings/{id}:
 *   get:
 *     summary: Read through a threaded comment timeline for a given listing
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback generated and organized
 */
router.get("/listings/:id", optionalProtect, index);

/**
 * @swagger
 * /api/comments/{id}/replies:
 *   get:
 *     summary: Parse out the nested child replies bound to a parent comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disclosed properly
 */
router.get("/:id/replies", optionalProtect, getReplies);

router.use(protect);

/**
 * @swagger
 * /api/comments/listings/{id}:
 *   post:
 *     summary: Push user feedback onto a target listing block
 *     tags: [Comments]
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
 *               parent_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Expression successfully persisted
 */
router.post("/listings/:id", create);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Perform typo correction or content rewrite on your prior comment
 *     tags: [Comments]
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
 *         description: Correction verified
 */
router.put("/:id", update);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Eliminate a comment node 
 *     tags: [Comments]
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
 *         description: Cleaned from layout
 */
router.delete("/:id", destroy);

/**
 * @swagger
 * /api/comments/{id}/likes:
 *   post:
 *     summary: Acknowledge an insightful comment via Like/Unlike toggle
 *     tags: [Comments]
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
 *         description: Empathy state successfully flipped 
 */
router.post("/:id/likes", like);

export default router;
