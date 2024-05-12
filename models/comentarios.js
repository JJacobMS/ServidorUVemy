'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comentarios extends Model {
    static associate(models) {
      comentarios.belongsTo(models.clases, {as: 'clases', foreignKey: 'idClase'});
      comentarios.belongsTo(models.usuarios, {as: 'usuarios', foreignKey: 'idUsuario'});
      comentarios.hasMany(models.comentarios, {as: 'comentarios', foreignKey: 'idComentario'});
    }
  }
  comentarios.init({
    idComentario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idClase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idComentario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'comentarios',
  });
  return comentarios;
};