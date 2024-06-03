const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken, generarTokenRegistro } = require('../services/jwttoken.service');

const TOKEN = generaToken(4, 'kikgamboa@gmail.com', 'Actualizar Perfil');

describe("GET /comentarios/:idClase", () => {

    test("TestObtenerComentariosExito", async () => {
        const response = await request(app).get("/api/comentarios/2").set('Authorization', `Bearer ${TOKEN}`);
        expect(response.statusCode).toBe(CodigosRespuesta.OK);
    });

});

describe("POST /comentarios", () => {
    
    test("TestCrearComentarioExito", async () => {
        const response = await request(app).post("/api/comentarios").set('Authorization', `Bearer ${TOKEN}`).send({
            idClase: 2,
            idUsuario: 4,
            descripcion: "Comentario de prueba"
        });
        expect(response.statusCode).toBe(CodigosRespuesta.CREATED);
        expect(response.body.idComentario).toBeDefined();
    });

    test("TestCrearComentarioUsuarioIncorrecto", async () => {
        const response = await request(app).post("/api/comentarios").set('Authorization', `Bearer ${TOKEN}`).send({
            idClase: 2,
            idUsuario: 1,
            descripcion: "Comentario de prueba"
        });
        expect(response.statusCode).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("Usuario incorrecto");
    });

    test("TestCrearComentarioRespuestaComentarioNoExistente", async () => {
        const response = await request(app).post("/api/comentarios").set('Authorization', `Bearer ${TOKEN}`).send({
            idClase: 2,
            idUsuario: 4,
            descripcion: "Comentario de prueba",
            respondeAComentario: 100
        });
        expect(response.statusCode).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("Comentario al que responde no existente");
    });

    test("TestCrearComentarioRespuestaClaseDistinta", async () => {
        const response = await request(app).post("/api/comentarios").set('Authorization', `Bearer ${TOKEN}`).send({
            idClase: 2,
            idUsuario: 4,
            descripcion: "Comentario de prueba",
            respondeAComentario: 1
        });
        expect(response.statusCode).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("Comentario al que responde no pertenece a la misma clase");
    });

    test("TestCrearComentarioRespuestaARespuesta", async () => {
        const response = await request(app).post("/api/comentarios").set('Authorization', `Bearer ${TOKEN}`).send({
            idClase: 2,
            idUsuario: 4,
            descripcion: "Comentario de prueba",
            respondeAComentario: 8
        });
        expect(response.statusCode).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("No se puede responder a un comentario que es respuesta a otro comentario");
    });

    test("TestCrearComentarioRespuestaExito", async () => {
        const response = await request(app).post("/api/comentarios").set('Authorization', `Bearer ${TOKEN}`).send({
            idClase: 2,
            idUsuario: 4,
            descripcion: "Comentario respuesta de prueba",
            respondeAComentario: 7
        });
        expect(response.statusCode).toBe(CodigosRespuesta.CREATED);
        expect(response.body.idComentario).toBeDefined();
    });
});