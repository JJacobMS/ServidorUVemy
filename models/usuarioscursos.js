'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarioscursos extends Model {
    static associate(models) {
      usuarioscursos.belongsTo(models.cursos, { foreignKey: 'idCurso' });
      usuarioscursos.belongsTo(models.usuarios, { foreignKey: 'idUsuario' });
    }
  }
  usuarioscursos.init({
    idUsuarioCurso:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, 
    calificacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idCurso:{
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    idUsuario:{
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'usuarioscursos',
    timestamps: false
  });
  return usuarioscursos;
};