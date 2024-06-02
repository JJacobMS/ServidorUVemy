const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(1, 'melus477@gmail.com', 'Sulem');

describe("POST /api/cursos/inscripcion/:id", function (){

    test("TestInscribirseACurso", async () =>{
        const peticion = {idCurso: 3, idUsuario: 4};
        const response = await request(app).post("/api/cursos/inscripcion/3").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.CREATED);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idCurso).toBeDefined();
        expect(response.body.idUsuario).toBeDefined();
    });

    test("TestInscribirseACursoDiferentesID", async () =>{
        const peticion = {idCurso: 40000, idUsuario: 1};
        const response = await request(app).post("/api/cursos/inscripcion/1").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestInscribirseACursoNoExistente", async () =>{
        const peticion = {idCurso: 40000, idUsuario: 1};
        const response = await request(app).post("/api/cursos/inscripcion/40000").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);   
    });

    test("TestInscribirseACursoConUsuarioNoExistente", async () =>{
        const peticion = {idCurso: 3, idUsuario: 40000};
        const response = await request(app).post("/api/cursos/inscripcion/3").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);   
    });

    test("TestInscribirseACursoSiendoProfesorDelCurso", async () =>{
        const peticion = {idCurso: 3, idUsuario: 2};
        const response = await request(app).post("/api/cursos/inscripcion/3").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestInscribirseACursoDondeYaEstaInscrito", async () =>{
        const peticion = {idCurso: 3, idUsuario: 1};
        const response = await request(app).post("/api/cursos/inscripcion/3").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });
    
});

describe("POST /api/cursos/calificacion/:id", function (){

    test("TestCalificarCurso", async () =>{
        const peticion = {idCurso: 3, idUsuario: 1, calificacion: 10};
        const response = await request(app).post("/api/cursos/calificacion/3").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.CREATED);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idCurso).toBeDefined();
        expect(response.body.idUsuario).toBeDefined();
        expect(response.body.calificacion).toBeDefined();
    });

    test("TestCalificarCursoDiferentesID", async () =>{
        const peticion = {idCurso: 40000, idUsuario: 1, calificacion: 10};
        const response = await request(app).post("/api/cursos/calificacion/1").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestCalificarCursoConUsuarioNoInscrito", async () =>{
        const peticion = {idCurso: 3, idUsuario: 5, calificacion: 10};
        const response = await request(app).post("/api/cursos/calificacion/3").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });
});

describe("GET /api/cursos/calificacion/:idCurso/:idUsuario", function (){

    test("TestObtenerCalificacionCursoDelUsuario", async () =>{
        const response = await request(app).get("/api/cursos/calificacion/1/1").send();
        expect(response.status).toBe(CodigosRespuesta.OK);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idUsuario).toBeDefined();
        expect(response.body.calificacion).toBeDefined();
    });

    test("TestObtenerCalificacionCursoNoExistente", async () =>{
        const response = await request(app).get("/api/cursos/calificacion/40000/1").send();
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);   
    });

    test("TestObtenerCalificacionCursoConUsuarioNoInscrito", async () =>{
        const response = await request(app).get("/api/cursos/calificacion/3/50").send();
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });
});