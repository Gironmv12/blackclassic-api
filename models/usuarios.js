import { DataTypes } from "sequelize";

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
    rol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "activo",
    },
  }, {
    sequelize,
    tableName: "usuarios",
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
