const { documentos, tiposarchivos } = require('../models');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await documentos.findAll({ attributes: ['idDocumento', 'archivo', 'nombre', 'idTipoArchivo', 'idCurso', 'idClase']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

self.crear = async function(req, res){
    try{
        const idTipoArch = await obtenerIdTipoArchivoPDF();
        if(idTipoArch == 0) return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error al crear el documento");

        const archivoBuffer = req.file.buffer;

        const data = await documentos.create({
            archivo: archivoBuffer,
            nombre: req.body.nombre,
            idClase: req.body.idClase,
            idTipoArchivo: idTipoArch
        });

        if(data == null) return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error al crear el documento " + req.body.nombre);

        const respuesta = {
            idDocumento: data.idDocumento,
            nombre: data.nombre,
            idClase: data.idClase,
            idTipoArchivo: data.idTipoArchivo
        }

        return res.status(201).json(respuesta);
    }catch(error){
        console.log(error);
        return res.status(500).json(error)
    }
}

async function obtenerIdTipoArchivoPDF(){
    let idTipoArchivo;
    try{
        const tipoArchivoVideo = await tiposarchivos.findOne({ where: {nombre: "application/pdf"}, attributes: ['idTipoArchivo']});
        if(tipoArchivoVideo == null){
            const tipoNuevo = await tiposarchivos.create({
                nombre: "application/pdf"
            });
            if(tipoNuevo == null){
                idTipoArchivo = 0;
            }else{
                idTipoArchivo = tipoNuevo.idTipoArchivo;
            }
        }else{
            idTipoArchivo = tipoArchivoVideo.dataValues.idTipoArchivo;
        }
    }catch(error){
        console.log(error);
        idTipoArchivo = 0;
    }
    return idTipoArchivo;
}

function validarFile(){
    
}

module.exports = self;
