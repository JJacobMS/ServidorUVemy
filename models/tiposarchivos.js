'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tiposarchivos extends Model {
    static associate(models) {
      tiposarchivos.hasMany(models.documentos, { as: 'tiposarchivos', foreignKey: 'idTipoArchivo'})
    }
  }
  tiposarchivos.init({
    idTipoArchivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'tiposarchivos',
    timestamps: false
  });
  return tiposarchivos;
};