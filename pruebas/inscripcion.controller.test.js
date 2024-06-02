const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(3, 'Enrique@gmail.com', 'Enrique');
const TOKEN_PROFESOR = generaToken(2, 'jacob@gmail.com', 'Jacob');
const TOKEN_ESTUDIANTE = generaToken(4, 'alvaro@gmail.com', 'Alvaro');
const TOKEN_USUARIO = generaToken(5, 'jazmin@gmail.com', 'Jazmin');
const TOKEN_USUARIO_NO_EXISTE = generaToken(4000000, 'no@gmail.com', 'no');

describe("POST /api/cursos/inscripcion/:id", function (){

    test("TestInscribirseACurso", async () =>{
        const peticion = {idCurso: 1};
        const response = await request(app).post("/api/cursos/inscripcion/1").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.CREATED);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idCurso).toBeDefined();
        expect(response.body.idUsuario).toBeDefined();
    });

    test("TestInscribirseACursoDiferentesID", async () =>{
        const peticion = {idCurso: 40000};
        const response = await request(app).post("/api/cursos/inscripcion/1").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestInscribirseACursoNoExistente", async () =>{
        const peticion = {idCurso: 40000};
        const response = await request(app).post("/api/cursos/inscripcion/40000").set('Authorization', `Bearer ${TOKEN_USUARIO_NO_EXISTE}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);   
    });

    test("TestInscribirseACursoConUsuarioNoExistente", async () =>{
        const peticion = {idCurso: 3 };
        const response = await request(app).post("/api/cursos/inscripcion/1").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestInscribirseACursoSiendoProfesorDelCurso", async () =>{
        const peticion = {idCurso: 3};
        const response = await request(app).post("/api/cursos/inscripcion/1").set('Authorization', `Bearer ${TOKEN_PROFESOR}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestInscribirseACursoDondeYaEstaInscrito", async () =>{
        const peticion = {idCurso: 3};
        const response = await request(app).post("/api/cursos/inscripcion/1").set('Authorization', `Bearer ${TOKEN_ESTUDIANTE}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });
    
});

describe("POST /api/cursos/calificacion/:id", function (){

    test("TestCalificarCurso", async () =>{
        const peticion = {idCurso: 1, calificacion: 10};
        const response = await request(app).post("/api/cursos/calificacion/1").set('Authorization', `Bearer ${TOKEN_ESTUDIANTE}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.CREATED);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idCurso).toBeDefined();
        expect(response.body.idUsuario).toBeDefined();
        expect(response.body.calificacion).toBeDefined();
    });

    test("TestCalificarCursoDiferentesID", async () =>{
        const peticion = {idCurso: 40000, calificacion: 10};
        const response = await request(app).post("/api/cursos/calificacion/1").set('Authorization', `Bearer ${TOKEN_ESTUDIANTE}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);   
    });

    test("TestCalificarCursoConUsuarioNoInscrito", async () =>{
        const peticion = {idCurso: 1, calificacion: 10};
        const response = await request(app).post("/api/cursos/calificacion/1").set('Authorization', `Bearer ${TOKEN_USUARIO}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.UNAUTHORIZED);   
    });
});

describe("GET /api/cursos/calificacion/:idCurso", function (){

    test("TestObtenerCalificacionCursoDelUsuario", async () =>{
        const response = await request(app).get("/api/cursos/calificacion/1").set('Authorization', `Bearer ${TOKEN_ESTUDIANTE}`).send();
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idUsuario).toBeDefined();
        expect(response.body.calificacion).toBeDefined();
    });

    test("TestObtenerCalificacionCursoNoExistente", async () =>{
        const response = await request(app).get("/api/cursos/calificacion/40000").set('Authorization', `Bearer ${TOKEN_ESTUDIANTE}`).send();
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);   
    });

    test("TestObtenerCalificacionCursoConUsuarioNoInscrito", async () =>{
        const response = await request(app).get("/api/cursos/calificacion/1").set('Authorization', `Bearer ${TOKEN_USUARIO}`).send();
        expect(response.status).toBe(CodigosRespuesta.UNAUTHORIZED);   
    });
});