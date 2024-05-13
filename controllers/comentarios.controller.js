const { sequelize, DataTypes } = require('sequelize');
const comentarios = require('../models/comentarios');
const db = require('../models/index');
const comentarios = db.comentarios;
let self = {}

self.get = async function (req, res) {
    try {
        let { idClase } = req.params;
        let data = await comentarios.findAll({
            where: {
                idClase: idClase
            }
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

self.create = async function (req, res) {
    try {
        let data = await comentarios.create({
            idClase: req.body.idClase,
            idUsuario: req.body.idUsuario,
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            idRespuestaAComentario: req.body.idRespuestaAComentario
        });
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = self;