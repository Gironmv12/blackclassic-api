import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("roles", {
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
    tableName: "roles",
    schema: "public",
    timestamps: false,
  });
}