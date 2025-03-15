import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("mesas", {
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
    idacceso: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "accesos",
        key: "id",
      },
    },
    numeroasientos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "disponible",
    },
    horainicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date("2025-03-15T18:00:00") 
    }
  }, {
    sequelize,
    tableName: "mesas",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "mesas_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
