import {
  createComment,
  deleteComment,
  getCommentReplies,
  getListingComment,
  toggleLike,
  updateComment,
} from "../services/comment.service.js";

export const index = async (req, res, next) => {
  try {
    const { id: listingId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const result = await getListingComment(
      listingId,
      parseInt(limit),
      parseInt(page),
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: result.rows,
      total: result.count,
    });
  } catch (error) {
    next(error);
  }
};

export const getReplies = async (req, res, next) => {
  try {
    const { id: parentId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const result = await getCommentReplies(
      parentId,
      parseInt(limit),
      parseInt(page),
      req.user?.id
    );
    res.status(200).json({
      success: true,
      data: result.rows,
      total: result.count,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { id: listingId } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user.id;

    const result = await createComment(listingId, userId, content, parent_id, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const result = await updateComment(commentId, userId, content, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;

    await deleteComment(commentId, userId, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    res.status(200).json({
      success: true,
      message: "Bình luận đã được xóa.",
    });
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: commentId } = req.params;

    const isLiked = await toggleLike(commentId, userId);

    res.status(200).json({
      success: true,
      message: isLiked
        ? "Bạn đã thích bình luận này."
        : "Bạn đã bỏ thích bình luận này.",
      data: {
        liked: isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};
