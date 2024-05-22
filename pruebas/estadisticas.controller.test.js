const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(1, 'melus477@gmail.com', 'Sulem');

describe("GET /api/cursos/estadisticas/:id", function(){

    test("TestObtenerEstadisticasCurso", async () =>{
        const response = await request(app).get("/api/cursos/estadisticas/1").send();
        expect(response.status).toBe(CodigosRespuesta.OK);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.nombre).toBeDefined();
        expect(response.body.calificacionCurso).toBeDefined();
        expect(response.body.promedioComentarios).toBeDefined();
        expect(response.body.estudiantesInscritos).toBeDefined();
        expect(response.body.etiquetasCoinciden).toBeDefined();
        expect(response.body.clases).toBeDefined();
        expect(response.body.estudiantes).toBeDefined();
    });

    test("TestObtenerEstadisticasCursoNoExistente", async () =>{
        const response = await request(app).get("/api/cursos/estadisticas/400000").send();
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);       
    });

});

describe("GET /api/cursos/reporte/:id", function(){

    test("TestObtenerReporteCurso", async () =>{
        const response = await request(app).get("/api/cursos/reporte/1").send();
        expect(response.status).toBe(CodigosRespuesta.OK);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/pdf"));
    });

    test("TestObtenerReporteCursoNoExistente", async () =>{
        const response = await request(app).get("/api/cursos/reporte/400000").send();
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });

});