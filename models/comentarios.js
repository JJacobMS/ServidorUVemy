'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class comentarios extends Model {
    static associate(models) {
      comentarios.belongsTo(models.clases, { as: 'clase', foreignKey: 'id' });
      comentarios.belongsTo(models.usuarios, { as: 'usuario', foreignKey: 'idUsuario' });
      comentarios.hasMany(models.comentarios, { as: 'comentarios', foreignKey: 'idComentario' });
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
    modelName: 'comentarios',
    timestamps: false
  });
  return comentarios;
};