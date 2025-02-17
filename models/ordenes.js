import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define("ordenes", {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    idreserva: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "reservas",
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
    numeroorden: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fechaorden: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalorden: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "ordenes",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "ordenes_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  });
}
