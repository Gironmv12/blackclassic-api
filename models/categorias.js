import { DataTypes } from "sequelize";

export default function (sequelize) {
    return sequelize.define("categorias", {
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
            validate: {
              isIn: [['materia prima', 'botella', 'bebida']], // Validación de las opciones posibles
            }
          }
    }, {
        sequelize,
    tableName: "categorias",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "categorias_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
    });
};