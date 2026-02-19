"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    static associate(models) {
      // 1 comments -> N comment_like
      CommentLike.belongsTo(models.Comment, {
        foreignKey: "comment_id",
        as: "comment",
      });

      // 1 users -> N comment_like
      CommentLike.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  CommentLike.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      comment_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CommentLike",
      tableName: "comment_likes",
      timestamps: true,
      underscored: true,
      updatedAt: false,
    }
  );

  return CommentLike;
};
