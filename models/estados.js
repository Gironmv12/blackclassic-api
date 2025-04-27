import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("estados", {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "estados",
    schema: "public",
    timestamps: false,
  });
}