'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comentarios extends Model {
    static associate(models) {
      Comentarios.belongsTo(models.clases, { as: 'clase', foreignKey: 'id' });
      Comentarios.belongsTo(models.usuarios, { as: 'usuario', foreignKey: 'idUsuario' });
      Comentarios.hasMany(models.comentarios, { as: 'comentarios', foreignKey: 'idComentario' });
    }
  }
  Comentarios.init({
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
    idRespuestaAComentario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comentarios',
        key: 'idComentario'
      },
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Comentarios',
  });
  return Comentarios;
};