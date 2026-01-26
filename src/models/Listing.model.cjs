"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    static associate(models) {
      // N Listings -> 1 ListingType
      Listing.belongsTo(models.ListingType, {
        foreignKey: "listing_type_id",
        as: "listing_type",
      });

      // 1 Listing -> N ListingImages
      Listing.hasMany(models.ListingImage, {
        foreignKey: "listing_id",
        as: "images",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // N Listings -> N Amenities through ListingAmenity
      Listing.belongsToMany(models.Amenity, {
        through: models.ListingAmenity,
        foreignKey: "listing_id",
        otherKey: "amenity_id",
        as: "amenities",
      });
    }
  }

  Listing.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      listing_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      area: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      province_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ward_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      rules: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      utilities: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "DRAFT",
      },
      show_phone_number: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Listing",
      tableName: "listings",
      timestamps: true,
      underscored: true,
    }
  );

  return Listing;
};
