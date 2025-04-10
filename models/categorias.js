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