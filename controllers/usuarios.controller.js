const { sequelize, DataTypes } = require('sequelize');
const { Op } = require('sequelize');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const usuario = require('../models/usuarios');
const db = require('../models/index');
const usuarios = db.usuarios;
const cursos = db.cursos;
let self = {}

self.getAll = async function (req, res){
    try {
        let pagina = parseInt(req.params.pagina, 10);
        if (pagina < 1) {
            pagina = 1; 
        }
        
        let limite = 6;
        let offset = (pagina - 1) * limite;

        let data = await usuarios.findAll({
            attributes: ['idUsuario', 'nombres', 'apellidos', 'imagen', 'correoElectronico', 'esAdministrador'],
            limit: limite,
            offset: offset
        });
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        let data = await usuarios.findByPk(id, { attributes: ['idUsuario', 'nombres', 'apellidos', 'correoElectronico', 'contrasena']});
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
        let data = await usuarios.create({
            idUsuario: req.body.idUsuario,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            correoElectronico: req.body.correoElectronico,
            contrasena: req.body.contrasena
        })
        return res.status(CodigosRespuesta.CREATED).json(data);
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.update = async function(req, res){
    try{
        let id = req.params.id;
        let body = req.body;
        let data = await usuarios.update(body, {where:{idUsuario:id}});
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
        let data = await usuarios.findByPk(id);
        data = await usuarios.destroy({ where : {idUsuario:id}});
        if(data === 1){
            return res.status(204).send()
        }else{
            return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.getAllBusqueda = async function (req, res) {
    try {
        let pagina = parseInt(req.params.pagina, 10);
        if (pagina < 1) {
            pagina = 1;
        }

        let limite = 6;
        let offset = (pagina - 1) * limite;
        let busqueda = req.query.busqueda || '';

        let data = await usuarios.findAndCountAll({
            where: {
                [Op.or]: [
                    { nombres: { [Op.like]: `%${busqueda}%` } },
                    { apellidos: { [Op.like]: `%${busqueda}%` } }
                ]
            },
            attributes: ['idUsuario', 'nombres', 'apellidos', 'imagen', 'correoElectronico', 'esAdministrador'],
            limit: limite,
            offset: offset
        });

        return res.status(200).json({
            data: data.rows,
            total: data.count,
            totalPages: Math.ceil(data.count / limite),
            currentPage: pagina
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


module.exports = self;