'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuariosetiquetas extends Model {
    static associate(models) {
      usuariosetiquetas.belongsTo(models.etiquetas, {foreignKey: 'idEtiqueta'});
      usuariosetiquetas.belongsTo(models.usuarios, {foreignKey: 'idUsuario'});
    }
  }
  usuariosetiquetas.init({
    idUsuarioEtiqueta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idEtiqueta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'usuariosetiquetas',
    timestamps: false
  });
  return usuariosetiquetas;
};