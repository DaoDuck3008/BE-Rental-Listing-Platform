"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ListingImage extends Model {
    static associate(models) {
      // 1 Listing -> N ListingImages
      ListingImage.belongsTo(models.Listing, {
        foreignKey: "listing_id",
        as: "listing",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  ListingImage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      listing_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ListingImage",
      tableName: "listing_images",
      timestamps: true,
      underscored: true,
    }
  );

  return ListingImage;
};
