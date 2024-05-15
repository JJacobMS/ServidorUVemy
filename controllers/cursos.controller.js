const { sequelize, DataTypes } = require('sequelize');
const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('./cursosetiquetas.controller');
const usuarioscursos = require('./usuarioscursos.controller');
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
        let id = req.params.id;
        let body = req.body;
        let data = await curso.update(body, {where:{idCurso:id}});
        if(data[0]==0){
            return res.status(404).send()
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
        resultadoUsuarios = await eliminarUsuariosInscritosDelCurso(id);
        if(resultadoUsuarios===404  || resultadoUsuarios===204){
            resultadoEtiquetas = await eliminarEtiquetasDelCurso(id);
            if(resultadoEtiquetas===404  || resultadoEtiquetas===204){
                data = await curso.destroy({ where : {idCurso:id}});
                if(data === 1){
                    return res.status(204).send()
                }else{
                    return res.status(404).send()
                }
            }
            else{
                return res.status(resultadoEtiquetas).send()
            }
        } else {
            return res.status(resultadoUsuarios).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function eliminarEtiquetasDelCurso(cursoId) {
    const resultado = await cursosetiquetas.borrarEtiquetasDelCurso(cursoId);
    return resultado;
}

async function eliminarUsuariosInscritosDelCurso(cursoId) {
    const resultado = await usuarioscursos.borrarUsuariosInscritosDelCurso(cursoId);
    return resultado;
}

module.exports = self;