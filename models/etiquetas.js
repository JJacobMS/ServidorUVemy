'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class etiquetas extends Model {
    static associate(models) {
      etiquetas.belongsToMany(models.usuarios, { as: 'usuarios', through: 'usuariosetiquetas', foreignKey: 'idEtiqueta'});
    }
  }
  etiquetas.init({
    idEtiqueta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'etiquetas',
    timestamps: false
  });
  return etiquetas;
};