"use strict";

const { Model } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
  class Destination extends Model {
    static associate(models) {
      // define association here
    }
  }

  Destination.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.GEOGRAPHY("POINT", 4326),
        allowNull: false,
      },
      province_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ward_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize: Sequelize,
      modelName: "Destination",
      tableName: "destinations",
      timestamps: true,
      underscored: true,
    }
  );

  return Destination;
};
