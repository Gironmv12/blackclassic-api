import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("pagos", {
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
    idreserva: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "reservas",
        key: "id",
      },
    },
    montopagado: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    metodopago: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fechapago: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "pagos",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "pagos_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
