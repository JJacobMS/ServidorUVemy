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

const recuperarUsuariosBusquedaSchema = () => {
    return {
        pagina: {
            in: ['params'],
            notEmpty: {
                errorMessage: 'Número de página es requerido'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'Número de página debe ser un número entero mayor o igual a 1'
            }
        },
        busqueda: {
            in: ['query'],
            optional: true,
            isString: {
                errorMessage: 'La búsqueda debe ser un texto'
            },
            matches: {
                options: [/^[a-zA-ZñÑ\s]*$/],
                errorMessage: 'La búsqueda solo puede contener letras'
            }
        }
    };
};

module.exports = { recuperarUsuarioSchema, recuperarUsuariosBusquedaSchema }