import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("recetas", {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    idproducto: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "productos",
        key: "id",
      },
    },
    idingrediente: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    unidad: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: "recetas",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "recetas_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
