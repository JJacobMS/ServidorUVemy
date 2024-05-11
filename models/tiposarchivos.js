'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tiposarchivos extends Model {
    static associate(models) {
      tiposarchivos.hasMany(models.documentos)
    }
  }
  tiposarchivos.init({
    idTipoArchivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tiposarchivos',
  });
  return tiposarchivos;
};