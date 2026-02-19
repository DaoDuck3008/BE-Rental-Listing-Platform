"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // N Comments -> 1 User
      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // N Comments -> 1 Listing
      Comment.belongsTo(models.Listing, {
        foreignKey: "listing_id",
        as: "listing",
      });

      // 1 Comment -> N Replies
      Comment.hasMany(models.Comment, {
        foreignKey: "parent_id",
        as: "replies",
      });

      // N Replies -> 1 Parent Comment
      Comment.belongsTo(models.Comment, {
        foreignKey: "parent_id",
        as: "parent",
      });

      // 1 Comment -> N Likes
      Comment.hasMany(models.CommentLike, {
        foreignKey: "comment_id",
        as: "likes",
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      listing_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      like_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
      underscored: true,
    }
  );

  return Comment;
};
