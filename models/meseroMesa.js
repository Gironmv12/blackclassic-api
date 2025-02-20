export default function meseroMesas(sequelize, DataTypes) {
    return sequelize.define('MeserosMesas', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        idUsuario: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Usuarios',
                key: 'id'
            }
        },
        idMesa: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Mesas',
                key: 'id'
            }
        }
    }, {});
}