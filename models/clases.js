'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clases extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  clases.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    idCurso: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'clases',
  });
  return clases;
};