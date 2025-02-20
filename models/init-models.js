import { DataTypes } from "sequelize";
import _accesos from "./accesos.js";
import _clientes from "./clientes.js";
import _detalleorden from "./detalleorden.js";
import _inventarios from "./inventarios.js";
import _mesas from "./mesas.js";
import _ordenes from "./ordenes.js";
import _pagos from "./pagos.js";
import _productos from "./productos.js";
import _recetas from "./recetas.js";
import _reservas from "./reservas.js";
import _usuarios from "./usuarios.js";
import _categorias from "./categorias.js";
import _meseroMesas from "./meseroMesa.js"; // Solo se importa una vez

export function initModels(sequelize) {
  const accesos = _accesos(sequelize, DataTypes);
  const clientes = _clientes(sequelize, DataTypes);
  const detalleorden = _detalleorden(sequelize, DataTypes);
  const inventarios = _inventarios(sequelize, DataTypes);
  const mesas = _mesas(sequelize, DataTypes);
  const ordenes = _ordenes(sequelize, DataTypes);
  const pagos = _pagos(sequelize, DataTypes);
  const productos = _productos(sequelize, DataTypes);
  const recetas = _recetas(sequelize, DataTypes);
  const reservas = _reservas(sequelize, DataTypes);
  const usuarios = _usuarios(sequelize, DataTypes);
  const categorias = _categorias(sequelize, DataTypes);
  const meseroMesas = _meseroMesas(sequelize, DataTypes); // Inicializar el modelo

  mesas.belongsTo(accesos, { as: "idacceso_acceso", foreignKey: "idacceso" });
  accesos.hasMany(mesas, { as: "mesas", foreignKey: "idacceso" });
  reservas.belongsTo(clientes, { as: "idcliente_cliente", foreignKey: "idcliente" });
  clientes.hasMany(reservas, { as: "reservas", foreignKey: "idcliente" });
  ordenes.belongsTo(mesas, { as: "idmesa_mesa", foreignKey: "idmesa" });
  mesas.hasMany(ordenes, { as: "ordenes", foreignKey: "idmesa" });
  reservas.belongsTo(mesas, { as: "idmesa_mesa", foreignKey: "idmesa" });
  mesas.hasMany(reservas, { as: "reservas", foreignKey: "idmesa" });
  detalleorden.belongsTo(ordenes, { as: "idorden_ordene", foreignKey: "idorden" });
  ordenes.hasMany(detalleorden, { as: "detalleordens", foreignKey: "idorden" });
  pagos.belongsTo(ordenes, { as: "idorden_ordene", foreignKey: "idorden" });
  ordenes.hasMany(pagos, { as: "pagos", foreignKey: "idorden" });
  detalleorden.belongsTo(productos, { as: "idproducto_producto", foreignKey: "idproducto" });
  productos.hasMany(detalleorden, { as: "detalleordens", foreignKey: "idproducto" });
  inventarios.belongsTo(productos, { as: "idproducto_producto", foreignKey: "idproducto" });
  productos.hasMany(inventarios, { as: "inventarios", foreignKey: "idproducto" });
  recetas.belongsTo(productos, { as: "idproducto_producto", foreignKey: "idproducto" });
  productos.hasMany(recetas, { as: "receta", foreignKey: "idproducto" });
  ordenes.belongsTo(reservas, { as: "idreserva_reserva", foreignKey: "idreserva" });
  reservas.hasMany(ordenes, { as: "ordenes", foreignKey: "idreserva" });
  pagos.belongsTo(reservas, { as: "idreserva_reserva", foreignKey: "idreserva" });
  reservas.hasMany(pagos, { as: "pagos", foreignKey: "idreserva" });

  productos.belongsTo(categorias, { foreignKey: "categoria_id", as: "categoria" });
  categorias.hasMany(productos, { foreignKey: "categoria_id", as: "productos" });
  
  meseroMesas.belongsTo(usuarios, { as: "usuario", foreignKey: "usuarioId" });
  usuarios.hasMany(meseroMesas, { as: "MeserosMesas", foreignKey: "usuarioId" });

  return {
    accesos,
    clientes,
    detalleorden,
    inventarios,
    mesas,
    ordenes,
    pagos,
    productos,
    recetas,
    reservas,
    usuarios,
    categorias,
    meseroMesas,
  };
}

export default initModels;