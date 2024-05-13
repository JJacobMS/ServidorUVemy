'use strict';
const {
  Model
} = require('sequelize');
const cursos = require('./cursos');
module.exports = (sequelize, DataTypes) => {
  class clases extends Model {
    static associate(models) {
      clases.belongsTo(models.cursos, { foreignKey : 'idCurso'})
    }
  }
  clases.init({
    idClase:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, 
    nombre: {
      type: DataTypes.STRING
    },
    descripcion: {
      type: DataTypes.STRING
    },
    idCurso: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'clases',
    timestamps: false
  });
  return clases;
};