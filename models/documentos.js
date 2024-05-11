'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documentos extends Model {
    static associate(models) {
      documentos.hasOne(models.clases, {foreignKey: "idClase"});
      documentos.hasOne(models.cursos, {foreignKey: "idCurso"});
    }
  }
  documentos.init({
    idDocumento: { 
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    archivo: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idTipoArchivo:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCurso:{
      type: DataTypes.INTEGER,
    },
    idClase: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'documentos',
  });
  return documentos;
};