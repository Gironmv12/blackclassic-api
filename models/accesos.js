import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("accesos", {
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
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: "accesos",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "accesos_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
