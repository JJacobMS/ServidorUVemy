const claimTypes = require('../config/claimtypes');
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
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["Clase no existente"] });
        }

        let { idClase } = req.params;
        let data = await comentarios.findAll({
            where: {
                idClase: idClase
            }
        });
        res.status(CodigosRespuesta.OK).json(data);
    } catch (error) {
        res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ detalles: [error.message] });
    }
}

self.create = async function (req, res) {
    try {
        const { idClase, idUsuario, descripcion, respondeAComentario } = req.body;
        const idUsuarioToken = req.tokenDecodificado[claimTypes.Id];

        const clase = await clases.findOne({
            where: { idClase: idClase }
        });

        if (!clase) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["Clase no existente"] });
        }

        const usuario = await usuarios.findOne({
            where: { idUsuario: idUsuario },
            raw: true,
            attributes: ['idUsuario']
        });

        if (!usuario || idUsuarioToken != idUsuario) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["Usuario incorrecto"] });
        }

        let nuevoComentario = {
            idClase: idClase,
            idUsuario: idUsuario,
            descripcion: descripcion,
            fecha: new Date(),
            respondeAComentario: null 
        };

        if (respondeAComentario) {
            const respuestaAComentario = await comentarios.findOne({
                where: { idComentario: respondeAComentario }
            });

            if (!respuestaAComentario) {
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["Comentario al que responde no existente"] });
            }

            nuevoComentario.respondeAComentario = respondeAComentario;
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
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ detalles: [error.message] });
    }
}


module.exports = self;