"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Amenity extends Model {
    static associate(models) {
      // N Amenities -> N Listings through ListingAmenity
      Amenity.belongsToMany(models.Listing, {
        through: models.ListingAmenity,
        foreignKey: "amenity_id",
        otherKey: "listing_id",
        as: "listings",
      });
    }
  }

  Amenity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Amenity",
      tableName: "amenities",
      timestamps: true,
      underscored: true,
    }
  );

  return Amenity;
};
