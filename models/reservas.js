import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("reservas", {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    idcliente: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "clientes",
        key: "id",
      },
    },
    idmesa: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "mesas",
        key: "id",
      },
    },
    horainicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    horafin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    codigoqr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    validada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: "reservas",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "reservas_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}