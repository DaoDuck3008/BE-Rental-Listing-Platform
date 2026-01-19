"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ListingAmenity extends Model {
    static associate(models) {}
  }

  ListingAmenity.init(
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
      amenity_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ListingAmenity",
      tableName: "listing_amenities",
      timestamps: true,
      underscored: true,
    }
  );

  return ListingAmenity;
};
