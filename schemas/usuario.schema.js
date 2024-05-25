const recuperarUsuarioSchema = () => {
    return {
        pagina: {
            in: ['params'],
            notEmpty: true,
            isDecimal: {
                options: { min: 1 },
                errorMessage: 'Número de página debe ser un número'
            },
            errorMessage: 'Número de página inválido'
        }
    };
};

module.exports = { recuperarUsuarioSchema }