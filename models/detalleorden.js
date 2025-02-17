import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("detalleorden", {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    idorden: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "ordenes",
        key: "id",
      },
    },
    idproducto: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "productos",
        key: "id",
      },
    },
    cantidad: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    preciounitario: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "detalleorden",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "detalleorden_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
