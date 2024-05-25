const crearEtiquetaSchema = () => {
    return {
        nombre: {
            in: ['body'],
            notEmpty: true,
            isLength: { options: { min: 1, max: 30 },  
                errorMessage: 'Nombre inválido'
            },
            errorMessage: 'Nombre inválido'
        }
    };
};

module.exports = { crearEtiquetaSchema };
