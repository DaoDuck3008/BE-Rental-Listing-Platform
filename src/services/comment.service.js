import DatabaseError from "../errors/DatabaseError.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import db from "../models/index.js";
import NotFoundError from "../errors/NotFoundError.js";
import AuthorizationError from "../errors/AuthorizationError.js";
import { clearPublishedListingDetailCache } from "./listing.service.js";

const { Comment, Listing, User, CommentLike, sequelize } = db;

export const getListingComment = async (
  listingId,
  limit = 10,
  page = 1,
  currentUserId = null
) => {
  try {
    const offset = (page - 1) * limit;

    const isLikedLiteral = currentUserId
      ? [
          sequelize.literal(
            `EXISTS(SELECT 1 FROM "comment_likes" WHERE "comment_likes"."comment_id" = "Comment"."id" AND "comment_likes"."user_id" = '${currentUserId}')`
          ),
          "isLiked",
        ]
      : [sequelize.literal("false"), "isLiked"];

    const isLikedLiteralReply = currentUserId
      ? [
          sequelize.literal(
            `EXISTS(SELECT 1 FROM "comment_likes" WHERE "comment_likes"."comment_id" = "replies"."id" AND "comment_likes"."user_id" = '${currentUserId}')`
          ),
          "isLiked",
        ]
      : [sequelize.literal("false"), "isLiked"];

    const result = await Comment.findAndCountAll({
      where: {
        listing_id: listingId,
        deleted_at: null,
        parent_id: null,
      },
      attributes: [
        "id",
        "user_id",
        "parent_id",
        "content",
        "like_count",
        "created_at",
        "updated_at",
        isLikedLiteral,
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "avatar"],
        },
        {
          model: Comment,
          as: "replies",
          where: { deleted_at: null },
          required: false,
          attributes: [
            "id",
            "user_id",
            "parent_id",
            "content",
            "like_count",
            "created_at",
            "updated_at",
            isLikedLiteralReply,
          ],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name", "avatar"],
            },
          ],
        },
      ],
      order: [
        ["created_at", "DESC"],
        [{ model: Comment, as: "replies" }, "created_at", "ASC"],
      ],
      limit,
      offset,
      distinct: true,
    });

    return result;
  } catch (error) {
    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    console.error("Lỗi không xác định khi lấy comments cho listing:", error);
    throw new DatabaseError("Lỗi không xác định khi lấy comments cho listing.");
  }
};

export const createComment = async (
  listingId,
  userId,
  content,
  parent_id = null
) => {
  try {
    const listing = await Listing.findOne({
      where: { id: listingId, status: "PUBLISHED", deleted_at: null },
    });

    if (!listing) {
      throw new NotFoundError(
        "Listing không tồn tại hoặc không hợp lệ để bình luận."
      );
    }

    const newComment = await Comment.create({
      listing_id: listingId,
      user_id: userId,
      content,
      parent_id,
    });

    const commentWithUser = await Comment.findByPk(newComment.id, {
      attributes: [
        "id",
        "user_id",
        "parent_id",
        "content",
        "like_count",
        "created_at",
        "updated_at",
        [sequelize.literal("false"), "isLiked"],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "avatar"],
        },
      ],
    });

    await clearPublishedListingDetailCache(listingId);
    return commentWithUser;
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    console.error("Lỗi không xác định khi tạo comment:", error);
    throw new DatabaseError("Lỗi không xác định khi tạo comment.");
  }
};

export const updateComment = async (commentId, userId, content) => {
  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw new NotFoundError("Bình luận không tồn tại.");
    }

    if (comment.user_id !== userId) {
      throw new AuthorizationError(
        "Bạn không có quyền chỉnh sửa bình luận này."
      );
    }

    await comment.update({ content });

    const updatedComment = await Comment.findByPk(commentId, {
      attributes: [
        "id",
        "user_id",
        "parent_id",
        "content",
        "like_count",
        "created_at",
        "updated_at",
        [
          sequelize.literal(
            `EXISTS(SELECT 1 FROM "comment_likes" WHERE "comment_likes"."comment_id" = "Comment"."id" AND "comment_likes"."user_id" = '${userId}')`
          ),
          "isLiked",
        ],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "avatar"],
        },
      ],
    });

    await clearPublishedListingDetailCache(comment.listing_id);
    return updatedComment;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    throw new DatabaseError("Lỗi khi cập nhật bình luận.");
  }
};

export const deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw new NotFoundError("Bình luận không tồn tại.");
    }

    if (comment.user_id !== userId) {
      throw new AuthorizationError("Bạn không có quyền xóa bình luận này.");
    }

    await comment.update({ deleted_at: new Date() });
    await clearPublishedListingDetailCache(comment.listing_id);

    return true;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    throw new DatabaseError("Lỗi khi xóa bình luận.");
  }
};

export const toggleLike = async (commentId, userId) => {
  const t = await sequelize.transaction();
  try {
    const comment = await Comment.findByPk(commentId, { transaction: t });

    if (!comment) {
      await t.rollback();
      throw new NotFoundError("Bình luận không tồn tại.");
    }

    const existingLike = await CommentLike.findOne({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
      transaction: t,
    });

    // Nếu như đã like thì bỏ like
    if (existingLike) {
      await CommentLike.destroy({
        where: {
          comment_id: commentId,
          user_id: userId,
        },
        transaction: t,
      });

      await Comment.decrement("like_count", {
        where: { id: commentId },
        transaction: t,
      });

      await t.commit();
      await clearPublishedListingDetailCache(comment.listing_id);
      return false;
    } else {
      await CommentLike.create(
        {
          comment_id: commentId,
          user_id: userId,
        },
        { transaction: t }
      );

      await Comment.increment("like_count", {
        where: { id: commentId },
        transaction: t,
      });

      await t.commit();
      await clearPublishedListingDetailCache(comment.listing_id);
      return true;
    }
  } catch (error) {
    if (t) await t.rollback();
    if (error instanceof NotFoundError || error instanceof AuthorizationError) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    throw new DatabaseError("Lỗi khi thích/bỏ thích bình luận.");
  }
};
