const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('../services/cursosetiquetas.service.');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const TipoCurso = require('../utils/tipoCurso');
const sequelize = db.sequelize;
const curso = db.cursos;
const documentosModel = db.documentos;
const tiposarchivosModel = db.tiposarchivos;
const etiquetasModel = db.etiquetas;
const usuarioscursosModel = db.usuarioscursos;
const claimTypes = require('../config/claimtypes');
const { Op } = require('sequelize');



let self = {}

self.get = async function(req, res){
    try{
        let id = req.params.pagina;
        let titulo = req.query.titulo;
        let etiqueta = req.query.etiqueta;
        let tipoCursos = req.query.tipoCursos;
        let calificacion = req.query.calificacion;
        
        console.log("titulo "+titulo+" "+"etiqueta "+etiqueta+" "+"tipoCursos "+tipoCursos+" "+"calificacion "+calificacion);
        if(isNaN(id)){
            return res.status(CodigosRespuesta.NOT_FOUND).json("Error al recuperar el recurso, la pagina no es valida");
        }

        if(id < 0){
            id = 0;
        }
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(isNaN(idUsuario)){
            return res.status(CodigosRespuesta.NOT_FOUND).json("Error al recuperar el recurso, el idUsuario no es valido");
        }

        let offset = -6;
        let limit = 6;
        let nombreTipoArchivo = 'image/png';

        for (let index = 0; index <= id; index++) {
            offset += 6;
        }

        if(etiqueta != undefined && !isNaN(etiqueta)){
            let cursosRecuperadosEtiquetas = await buscarCursosPorEtiqueta(etiqueta, offset, limit);
            
            if (cursosRecuperadosEtiquetas === undefined) {
                return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
            }
            if (cursosRecuperadosEtiquetas.length === 0) {
                return res.status(CodigosRespuesta.NOT_FOUND).json("No se encontraron cursos");
            }
            return res.status(CodigosRespuesta.OK).json(cursosRecuperadosEtiquetas)
        } 

        if(tipoCursos != undefined && !isNaN(tipoCursos) && tipoCursos ==  TipoCurso.CURSOSCREADOS  || tipoCursos == TipoCurso.CURSOSINSCRITOS ){
            let cursosRecuperadosEtiquetas = await buscarCursosPorTipoCurso(tipoCursos, idUsuario, offset, limit);
            
            if (cursosRecuperadosEtiquetas === undefined) {
                return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
            }
            if (cursosRecuperadosEtiquetas.length === 0) {
                console.log("cursosRecuperadosEtiquetas.length === 0");
                return res.status(CodigosRespuesta.NOT_FOUND).json("No se encontraron cursos");
            }
            return res.status(CodigosRespuesta.OK).json(cursosRecuperadosEtiquetas)
        } 

        if(calificacion != undefined && !isNaN(calificacion) && calificacion >= 0 || calificacion <= 10){
            let cursosRecuperadosCalificacion = await buscarCursosPorCalificacion(calificacion, offset, limit);
            if (cursosRecuperadosCalificacion === undefined) {
                return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
            }
            if (cursosRecuperadosCalificacion.length === 0) {
                return res.status(CodigosRespuesta.NOT_FOUND).json("No se encontraron cursos");
            }
            return res.status(CodigosRespuesta.OK).json(cursosRecuperadosCalificacion)
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

        let cursosRecuperados = await RecuperarCursosPorDocumento(offset, limit, cursoIds, titulo);

        if (cursosRecuperados.length === 0) {
            return res.status(CodigosRespuesta.NOT_FOUND).json("No se encontraron cursos");
        }
        return res.status(CodigosRespuesta.OK).json(cursosRecuperados)
    }catch(error){
        console.log(error.message);
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


async function buscarCursosPorEtiqueta(etiquetaId, offset, limit) {
    try{
        const cursosFiltrados = await curso.findAll({
            attributes: ['idCurso', 'titulo'],
            include: [
                {
                    model: etiquetasModel, 
                    as: 'etiquetas', 
                    where: { idEtiqueta: etiquetaId }
                }
            ],
            order: [['idCurso', 'ASC']],
            limit: limit,
            offset: offset
        });

        const cursoIds = cursosFiltrados.map(cur => cur.idCurso);
        let titulo = undefined;
        let cursosRecuperados = await RecuperarCursosPorDocumento(offset, limit, cursoIds, titulo);

        return cursosRecuperados;

    }catch(error){
        console.log(error.message);
        console.log(error);
        let cursosRecuperados = undefined;
        return cursosRecuperados;
    }
}

async function buscarCursosPorCalificacion(calificacion, offset, limit) {
    try{
        let calificacionFinal = 10;
        const cursosFiltrados = await usuarioscursosModel.findAll({
            attributes: [
                'idCurso'
            ],
            group: ['idCurso'],
            having: sequelize.where(
                sequelize.fn('AVG', sequelize.col('calificacion')),
                {
                    [Op.between]: [calificacion, calificacionFinal]
                }
            ),
            order: [['idCurso', 'ASC']],
            limit: limit,
            offset: offset
        });
        const cursoIds = cursosFiltrados.map(cur => cur.idCurso);

        let titulo = undefined;
        let cursosRecuperados = await RecuperarCursosPorDocumento(offset, limit, cursoIds, titulo);

        return cursosRecuperados;

    }catch(error){
        console.log(error.message);
        console.log(error);
        let cursosRecuperados = undefined;
        return cursosRecuperados;
    }
}


async function buscarCursosPorTipoCurso(tipoCursos, idUsuario, offset, limit) {
    try{
        console.log(tipoCursos);
        console.log(idUsuario);
        let cursosFiltrados
        if(tipoCursos == TipoCurso.CURSOSCREADOS){
            console.log("TipoCurso.CURSOSCREADOS");
            cursosFiltrados = await curso.findAll({
                where: {idUsuario: idUsuario},
                attributes: ['idCurso'],
                limit: limit,
                offset: offset
            });
            console.log("tamaño"+cursosFiltrados.length);
        }

        if(tipoCursos == TipoCurso.CURSOSINSCRITOS){
            console.log("TipoCurso.CURSOSINSCRITOS");
            cursosFiltrados = await usuarioscursosModel.findAll({
                attributes: [
                    'idCurso'
                ],
                where: { idUsuario: idUsuario },
                group: ['idCurso'],
                order: [['idCurso', 'ASC']],
                limit: limit,
                offset: offset
            });
        }

        const cursoIds = cursosFiltrados.map(cur => cur.idCurso);

        let titulo = undefined;
        let cursosRecuperados = await RecuperarCursosPorDocumento(offset, limit, cursoIds, titulo);
        console.log("tamaño2 "+cursosRecuperados.length);
        return cursosRecuperados;

    }catch(error){
        console.log(error.message);
        console.log(error);
        let cursosRecuperados = undefined;
        return cursosRecuperados;
    }
}

async function RecuperarCursosPorDocumento(offset, limit, cursoIds, titulo){
    
    let whereCondition = {
        idCurso: cursoIds
    };

    if (titulo!= undefined) {
        whereCondition.titulo = {
            [Op.like]: '%' + titulo + '%'
        };
    }

    const cursosRecuperados = await curso.findAll({
        attributes: ['idCurso', 'titulo'],
        where: whereCondition,
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
    return cursosRecuperados;
}

module.exports = self;