'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cursos extends Model {
    static associate(models) {
      cursos.hasMany(models.clases, { foreignKey: 'idCurso' });
    }
  }
  cursos.init({
    idCurso:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, 
    titulo: {
      type : DataTypes.STRING,
      allowNull: false
    }, 
    descripcion: {
      type : DataTypes.STRING,
      allowNull: false
    }, 
    objetivos: {
      type : DataTypes.STRING,
      allowNull: false
    }, 
    requisitos: {
      type : DataTypes.STRING,
      allowNull: false
    }, 
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'cursos',
    timestamps: false
  });
  return cursos;
};