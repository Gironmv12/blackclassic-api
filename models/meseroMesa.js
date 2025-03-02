export default function meseroMesas(sequelize, DataTypes) {
    return sequelize.define('MeserosMesas', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        usuarioId: {  // Campo consistente con la asociación en init-models
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'usuarios', // o "Usuarios", según tu configuración
                key: 'id'
            }
        },
        idMesa: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'mesas',  // asegúrate de que concuerde con el nombre de la tabla
                key: 'id'
            }
        }
    }, {
        timestamps: false  // Desactiva createdAt y updatedAt
    });
}