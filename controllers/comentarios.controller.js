const claimTypes = require('../config/claimtypes');
const { comentarios, usuarios, clases } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.get = async function (req, res) {
    try {
        let { idClase } = req.params;

        const clase = await clases.findOne({
            where: {
                idClase: idClase
            }
        });

        if (!clase) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["Clase no existente"] });
        }

        let data = await comentarios.findAll({
            where: {
                idClase: idClase
            },
            include: [{
                model: usuarios,
                as: 'usuario',
                attributes: ['nombres', 'apellidos']
            }]
        });

        // Crear un diccionario para mapear los comentarios por idComentario
        let comentariosMap = {};
        data.forEach(comentario => {
            let { idComentario, fecha, descripcion, idClase } = comentario;
            let nombreUsuario = comentario.usuario ? `${comentario.usuario.nombres} ${comentario.usuario.apellidos}` : null;
            comentariosMap[idComentario] = {
                idComentario,
                idClase,
                nombreUsuario,
                descripcion,
                fecha,
                respuestas: []
            };
        });

        // Agrupar respuestas dentro de los comentarios correspondientes
        data.forEach(comentario => {
            if (comentario.respondeAComentario) {
                let parentComentario = comentariosMap[comentario.respondeAComentario];
                if (parentComentario) {
                    parentComentario.respuestas.push(comentariosMap[comentario.idComentario]);
                }
            }
        });

        // Ordenar las respuestas por fecha (del más nuevo al más viejo)
        Object.values(comentariosMap).forEach(comentario => {
            comentario.respuestas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        });

        // Filtrar solo los comentarios que no son respuestas y ordenar por fecha (del más nuevo al más viejo)
        let dataFormateada = Object.values(comentariosMap)
            .filter(comentario => !data.some(c => c.idComentario === comentario.idComentario && c.respondeAComentario))
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        res.status(CodigosRespuesta.OK).json(dataFormateada);
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

            if(respuestaAComentario.idClase != idClase){
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["Comentario al que responde no pertenece a la misma clase"] });
            }

            if(!respuestaAComentario.respondeAComentario){
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ["No se puede responder a un comentario que es respuesta a otro comentario"] });
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