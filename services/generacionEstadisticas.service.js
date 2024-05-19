const { usuarioscursos, comentarios, clases, sequelize } = require('../models');
const { Sequelize, Op } = require('sequelize');

let self = {}

self.obtenerCalificacionTotal = async function (idCursoSolicitado){
    let calificaciontotal = await usuarioscursos.findOne({
            where: { idCurso: idCursoSolicitado },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('calificacion')), 'promedioCalificacion']]
        });
        
    return calificaciontotal;
}

self.obtenerClasesConComentarios = async function (idCursoSolicitado){
    let clasesConComentarios = await clases.findAll({ attributes: [ 'nombre',
        [Sequelize.fn('COUNT', Sequelize.col('comentarios.idComentario')), 'cantidadComentarios']],
        include: [{ model: comentarios, attributes: [] }],
        where: { idCurso: idCursoSolicitado }, group: ['clases.idClase'], raw: true 
    });
        
    return clasesConComentarios;
}

self.recuperarEtiquetas = async function (idCursoSolicitado){
    const queryEtiquetas = `SELECT etiquetas.nombre FROM cursosetiquetas
    INNER JOIN usuariosetiquetas ON usuariosetiquetas.idEtiqueta = cursosetiquetas.idEtiqueta
    INNER JOIN etiquetas ON cursosetiquetas.idEtiqueta = etiquetas.idEtiqueta
    WHERE cursosetiquetas.idCurso = :idCurso GROUP BY cursosetiquetas.idEtiqueta, etiquetas.nombre;
    `;

    const [etiquetasCoinciden, metadata] = await sequelize.query(queryEtiquetas, {
        replacements: { idCurso: idCursoSolicitado }          
    });

    let etiquetasNombres = [];
    for(const item of etiquetasCoinciden){
    etiquetasNombres.push(item.nombre);
    }
    
    return etiquetasNombres;
}

self.recuperarEstudiantesCurso = async function (idCursoSolicitado){
    const queryEstudiantes = `SELECT concat(nombres, " ", apellidos) AS nombre FROM usuarios
    INNER JOIN usuarioscursos ON usuarioscursos.idUsuario = usuarios.idUsuario WHERE usuarioscursos.idCurso = :idCurso`;

    const [resultsEstudiantes, metadataEs] = await sequelize.query(queryEstudiantes, {
        replacements: { idCurso: idCursoSolicitado }          
    });

    let estudiantesNombres = [];
    for(const item of resultsEstudiantes){
        estudiantesNombres.push(item.nombre);
    }
    return estudiantesNombres;
}

self.obtenerComentariosTotales = async function (idCursoSolicitado){
    const queryComentariosTotales = `SELECT count(idComentario) AS total FROM comentarios 
    RIGHT JOIN clases ON clases.idClase = comentarios.idClase WHERE clases.idCurso = :idCurso`;

    const [comentariosTotales, metadataComentarios] = await sequelize.query(queryComentariosTotales, {
        replacements: { idCurso: idCursoSolicitado }          
    });

    return comentariosTotales;
}

self.obtenerDesgloseCalificacion = async function (idCursoSolicitado){
    const calificaciones  = await usuarioscursos.findAll({
        attributes : [ 'calificacion', [Sequelize.fn('COUNT', Sequelize.col('calificacion')), 'total'] ],
        where : { idCurso: idCursoSolicitado, calificacion: { [Op.not] : null}},
        group: 'calificacion'
    });
    
    let calificacionPresentes = [];
    let numeroTotal = [];
    for(const item of calificaciones){
        calificacionPresentes.push(item.calificacion);
        numeroTotal.push(item.dataValues.total);
    }
    const calificacionDesglose = { calificaciones: calificacionPresentes, totalPorCalificacion: numeroTotal}
    console.log(calificacionDesglose);
    return calificacionDesglose;
}

module.exports = self;
