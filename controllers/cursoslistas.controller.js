const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('../services/cursosetiquetas.service.');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const sequelize = db.sequelize;
const curso = db.cursos;

let self = {}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        if(id < 0){
            id = 0;
        }
        let offset = -6;
        let limit = 6;
        let nombreTipoArchivo = 'jacob';
        for (let index = 0; index <= id; index++) {
            offset += 6;
        }

        cursosRecuperados = await sequelize.query(
            `SELECT cursos.idCurso, cursos.titulo, documentos.idDocumento, documentos.archivo
            FROM cursos 
            JOIN documentos ON cursos.idCurso=documentos.idCurso
            JOIN tiposarchivos ON documentos.idTipoArchivo=tiposarchivos.idTipoArchivo 
            WHERE tiposarchivos.nombre= :nombreTipoArchivo
            ORDER BY idCurso ASC  
            LIMIT :offset, :limit;`,
            {
              replacements: { nombreTipoArchivo, offset, limit },
              type: sequelize.QueryTypes.SELECT
            }
        )

        console.log(cursosRecuperados);
        if (cursosRecuperados.length === 0) {
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontraron cursos");
        }
        return res.status(CodigosRespuesta.OK).json(cursosRecuperados)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = self;