const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('../services/cursosetiquetas.service.');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const sequelize = db.sequelize;
const curso = db.cursos;
const documentosModel = db.documentos;
const tiposarchivosModel = db.tiposarchivos;

let self = {}

self.get = async function(req, res){
    try{
        let id = req.params.pagina;
        let calificacion = req.query.calificacion;
        if(isNaN(id)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al recuperar el recurso, el id no es valido");
        }
        //if calificacion es diferente de null y isNan
        if(id < 0){
            id = 0;
        }
        let offset = -6;
        let limit = 6;
        let nombreTipoArchivo = 'jacob';
        for (let index = 0; index <= id; index++) {
            offset += 6;
        }

        const documentos = await documentosModel.findAll({
            attributes: ['idCurso', 'idDocumento', 'archivo'],
            include: [
                {
                    model: tiposarchivosModel,
                    as: 'tiposarchivos',
                    where: { nombre: nombreTipoArchivo },
                    attributes: []
                }
            ],
            where: { idClase: null }
        });

        const cursoIds = documentos.map(doc => doc.idCurso);

        const cursosRecuperados = await curso.findAll({
            attributes: ['idCurso', 'titulo'],
            where: {
                idCurso: cursoIds
            },
            include: [
                {
                    model: documentosModel,
                    as: 'documentos',
                    attributes: ['idDocumento', 'archivo'],
                    where: { idClase: null },
                    limit: 1
                }
            ],
            order: [['idCurso', 'ASC']],
            limit: limit,
            offset: offset
        });
        if (cursosRecuperados.length === 0) {
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontraron cursos");
        }
        return res.status(CodigosRespuesta.OK).json(cursosRecuperados)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = self;