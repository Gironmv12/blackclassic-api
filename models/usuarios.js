import { DataTypes } from "sequelize";
import estados from "./estados.js";
import roles from "./roles.js";

export default function (sequelize) {
  return sequelize.define("usuarios", {
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
    apellidopaterno: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    apellidomaterno: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    correo: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "usuarios_correo_key",
    },
    contrasena: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: roles(sequelize),
        key: "id",
      },
    },
    estado_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: estados(sequelize),
        key: "id",
      },
    },
  }, {
    sequelize,
    tableName: "usuarios", // Asegúrate que el nombre sea en minúsculas
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "usuarios_correo_key",
        unique: true,
        fields: [{ name: "correo" }],
      },
      {
        name: "usuarios_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
