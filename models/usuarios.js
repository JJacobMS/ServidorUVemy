'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {
    static associate(models) {
      usuarios.belongsToMany(models.etiquetas, {through: 'usuariosetiquetas', foreignKey: 'idUsuario'});
      //usuarios.belongsToMany(models.cursos, {through: 'usuarioscursos', foreignKey: 'idUsuario'});
      //usuarios.hasMany(models.comentarios, {foreignKey: 'idUsuario'});
    }
  }
  usuarios.init({
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correoElectronico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'usuarios',
  });
  return usuarios;
};