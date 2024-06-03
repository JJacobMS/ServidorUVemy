const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'UVemy API',
        description: 'API en Node.js con Express para la plataforma de cursos en línea UVemy'
    },
    host: 'localhost:3000'
};

const outputFile = './swagger_output.json';
const routes = ['./index.js'];

swaggerAutogen(outputFile, routes, doc);