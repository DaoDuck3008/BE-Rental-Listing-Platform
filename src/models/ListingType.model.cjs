"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ListingType extends Model {
    static associate(models) {
      // 1 ListingType -> N Listings
      ListingType.hasMany(models.Listing, {
        foreignKey: "listing_type_id",
        as: "listings",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
    }
  }

  ListingType.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ListingType",
      tableName: "listing_types",
      timestamps: true,
      underscored: true,
    }
  );

  return ListingType;
};
