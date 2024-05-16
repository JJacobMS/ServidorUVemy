const { sequelize, DataTypes } = require('sequelize');
const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('./cursosetiquetas.controller');
const usuarioscursos = require('./usuarioscursos.controller');
const documentos = require('./documentos.controller');
const curso = db.cursos;
let self = {}

self.getAll = async function (req, res){
    try{
        let data = await curso.findAll({ attributes: ['idCurso', 'titulo', 'descripcion', 'objetivos', 'requisitos', 'idUsuario']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        let data = await curso.findByPk(id, { attributes: ['idCurso', 'titulo', 'descripcion', 'objetivos', 'requisitos', 'idUsuario']});
        if(data){
            return res.status(200).json(data)
        }else{
           return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.create = async function(req, res){
    try{
        let cursoCreado = await curso.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
            idUsuario: req.body.idUsuario
        })
        console.log(req.body.archivo);
        console.log(cursoCreado.idCurso);
        crearArchivoDelCurso(req.body.archivo, cursoCreado.idCurso);
        for (let etiquetaId of req.body.etiquetas) {
            await cursosetiquetas.crearCursosEtiquetas(cursoCreado.idCurso, etiquetaId);
        }
        return res.status(201).json(cursoCreado)
    }catch(error){
        return res.status(500).json({ error: error.message });
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
            idUsuario: req.body.idUsuario
        };
        //eliminar la miniatura y poner la nueva o solo actualizarla
        let id = req.params.id;
        let data = await curso.update(body, {where:{idCurso:id}});
        if(data[0]==0){
            resultadoEtiquetas = await eliminarEtiquetasDelCurso(id);
            if(resultadoEtiquetas===404  || resultadoEtiquetas===204){
                for (let etiquetaId of req.body.etiquetas) {
                    await cursosetiquetas.crearCursosEtiquetas(cursoCreado.idCurso, etiquetaId);
                }
                return res.status(404).send()
            }
            else{
                return res.status(resultadoEtiquetas).send()
            }
        }else{
            return res.status(204).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.delete = async function(req, res){
    try{
        let id = req.params.id;
        let data = await curso.findByPk(id);
        if(!data){
            return res.status(404).send()
        }
        data = await curso.destroy({ where : {idCurso:id}});
        if(data === 1){
            return res.status(204).send()
        }else{
            return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
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

module.exports = self;