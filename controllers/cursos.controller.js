const { sequelize, DataTypes } = require('sequelize');
const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('./cursosetiquetas.controller');
const usuarioscursos = require('./usuarioscursos.controller');
const documentos = require('./documentos.controller');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const curso = db.cursos;
const usuario = db.usuarios;
let self = {}

self.getAll = async function (req, res){
    try{
        let data = await curso.findAll({ attributes: ['idCurso', 'titulo', 'descripcion', 'objetivos', 'requisitos', 'idUsuario']})
        return res.status(CodigosRespuesta.OK).json(data)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        let cursoRecuperado = await curso.findByPk(id, { attributes: ['idCurso', 'titulo', 'descripcion', 'objetivos', 'requisitos', 'idUsuario']});
        if(cursoRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el curso")
        }
        return res.status(CodigosRespuesta.OK).json(cursoRecuperado)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.create = async function(req, res){
    try{
        let usuarioRecuperado = await usuario.findByPk(req.body.idUsuario);
        if(usuarioRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el usuario");
        }
        let cursoCreado = await curso.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
            idUsuario: req.body.idUsuario
        })
        if(cursoCreado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al crear el curso");
        }
        let archivoCreado = await crearArchivoDelCurso(req.body.archivo, cursoCreado.idCurso);
        if(archivoCreado.status==201){
            for (let etiquetaId of req.body.etiquetas) {
                crearCursosEtiquetas(cursoCreado.idCurso, etiquetaId);
                //Si no se crea una etiqueta no se crean las demas o q?, tal vez guardar cuando es erroneo o mostrar las que salieron mal
            }
        }
        return res.status(CodigosRespuesta.CREATED).json(cursoCreado)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.update = async function(req, res){
    try{
        let body = {
            id: req.params.id,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
        };
        let id = req.params.id;
        let resultadoArchivo = await actualizarArchivoDelCurso(req.body.idDocumento, req.body.archivo);
        if(resultadoArchivo===404  || resultadoArchivo===204){
            let data = await curso.update(body, {where:{idCurso:id}});
            if(data[0]==0){
                return res.status(CodigosRespuesta.NOT_FOUND).send();
            }else{
                resultadoEtiquetas = await eliminarEtiquetasDelCurso(id);
                if(resultadoEtiquetas===404  || resultadoEtiquetas===204){
                    for (let etiquetaId of req.body.etiquetas) {
                        crearCursosEtiquetas(id, etiquetaId);
                    }
                    return res.status(CodigosRespuesta.NO_CONTENT).send();
                }else{
                    return res.status(resultadoEtiquetas).send();
                }
            }
        } else{
            return res.status(resultadoArchivo).send();
        }
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.delete = async function(req, res){
    try{
        let id = req.params.id;
        let cursoRecuperado = await curso.findByPk(id);
        if(cursoRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el curso");
        }
        data = await curso.destroy({ where : {idCurso:id}});
        if(data === 1){
            return res.status(CodigosRespuesta.NO_CONTENT).send("Se ha eliminado el curso")
        }else{
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al eliminar el curso")
        }
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function eliminarEtiquetasDelCurso(cursoId) {
    const resultado = await cursosetiquetas.borrarEtiquetasDelCurso(cursoId);
    return resultado;
}

async function crearArchivoDelCurso(documento, idCurso) {
    const resultado = await documentos.crearArchivoDelCurso(documento,idCurso);
    return resultado;
}

async function eliminarArchivoDelCurso(documentoId) {
    const resultado = await documentos.borrarArchivoDelCurso(documentoId);
    return resultado;
}

async function actualizarArchivoDelCurso(idDocumento, documento) {
    const resultado = await documentos.actualizarArchivoDelCurso(idDocumento, documento);
    return resultado;
}


async function crearCursosEtiquetas(idCurso, etiquetaId) {
    const resultado = await cursosetiquetas.crearCursosEtiquetas(idCurso, etiquetaId);
    return resultado;
}


module.exports = self;