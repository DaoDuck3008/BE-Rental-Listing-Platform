"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      // N Favorites -> 1 User
      Favorite.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // N Favorites -> 1 Listing
      Favorite.belongsTo(models.Listing, {
        foreignKey: "listing_id",
        as: "listing",
      });
    }
  }

  Favorite.init(
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
    },
    {
      sequelize,
      modelName: "Favorite",
      tableName: "favorites",
      timestamps: true,
      updatedAt: false,
      underscored: true,
    }
  );

  return Favorite;
};
