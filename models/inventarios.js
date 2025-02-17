import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("inventarios", {
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
    cantidaddisponible: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    puntoreorden: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "inventarios",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "inventarios_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
