const { comentarios, usuarios, clases } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.get = async function (req, res) {
    try {
        const clase = await clases.findOne({
            where: {
                idClase: idClase
            }
        });

        if (!clase) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: "Clase no existente" });
        }

        let { idClase } = req.params;
        let data = await comentarios.findAll({
            where: {
                idClase: idClase
            }
        });
        res.status(CodigosRespuesta.OK).json(data);
    } catch (error) {
        res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.create = async function (req, res) {
    try {
        const { idClase, idUsuario, descripcion, idRespuestaAComentario } = req.body;

        const clase = await clases.findOne({
            where: {
                idClase: idClase
            }
        });

        if (!clase) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: "Clase no existente" });
        }

        const usuario = await usuarios.findOne({
            where: {
                idUsuario: idUsuario
            }
        });

        if (!usuario) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: "Usuario no existente" });
        }

        let nuevoComentario = {
            idClase: req.body.idClase,
            idUsuario: req.body.idUsuario,
            descripcion: req.body.descripcion,
            fecha: Date.now(),
        };

        if(idRespuestaAComentario) {
            const respuestaAComentario = await comentarios.findOne({
                where: {
                    idComentario: idRespuestaAComentario
                }
            });

            if (!respuestaAComentario) {
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: "Comentario al que responde no existente" });
            }
            nuevoComentario.idRespuestaAComentario = idRespuestaAComentario;
        }
        
        await comentarios.create(nuevoComentario);
        
        const comentarioCreado = await comentarios.findOne({
            where: {
                idClase: idClase,
                idUsuario: idUsuario,
                descripcion: descripcion,
            }
        });

        return res.status(CodigosRespuesta.CREATED).json({
            idComentario: comentarioCreado.idComentario
        });
    } catch (error) {
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = self;