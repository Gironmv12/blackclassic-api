import { DataTypes } from "sequelize";
import _categorias from "./categorias.js";

export default function (sequelize) {
  return sequelize.define("productos", {
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
    categoria_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: _categorias(sequelize),
        key: 'id',
      },
    },
    preciounitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'agotado', 'promoción'),
      allowNull: false,
      // La validación no es estrictamente necesaria, ya que el ENUM lo controla.
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: "productos",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "productos_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}