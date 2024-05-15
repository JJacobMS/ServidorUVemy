const { documentos } = require('../models');

async function enviarVideoClase (call, callback) {
    const stream = [];
    let datosDocumento;

    call.on('data', (message) =>{
        if(message.datosVideo != null){
            datosDocumento = message.datosVideo;
        }
        if(message.chunks != null){
            stream.push(message.chunks);
            console.log(".");
        }
    })

    call.on('end', async ()=>{
        const video = Buffer.concat(stream);
        const documento = await documentos.create({
            archivo: video,
            nombre: datosDocumento.nombre,
            idTipoArchivo: datosDocumento.idTipoArchivo,
            idClase: datosDocumento.idClase
        });
        const respuesta = { respuesta : documento};
        callback(null, respuesta);
    })
}   
module.exports = { enviarVideoClase };