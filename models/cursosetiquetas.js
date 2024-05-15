'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cursosetiquetas extends Model {
    static associate(models) {
      cursosetiquetas.belongsTo(models.cursos, { foreignKey: 'idCurso' });
      cursosetiquetas.belongsTo(models.etiquetas, { foreignKey: 'idEtiqueta' });
    }
  }
  cursosetiquetas.init({
    idCursoEtiqueta:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, 
    idCurso:{
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    idEtiqueta:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'cursosetiquetas',
    timestamps: false
  });
  return cursosetiquetas;
};