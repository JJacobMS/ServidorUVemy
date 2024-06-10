const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');

describe("POST /api/autenticacion/iniciarSesion", function(){
    
    test("TestIniciarSesionExito", async () => {
        const peticion = { correoElectronico: "kikgamboa@gmail.com", contrasena: "Contrasena1" };

        const response = await request(app).post("/api/autenticacion").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idUsuario).toBeDefined();
        expect(response.body.nombres).toBeDefined();
        expect(response.body.apellidos).toBeDefined();
        expect(response.body.correoElectronico).toBeDefined();
        expect(response.body.idsEtiqueta).toBeDefined();
        expect(response.body.jwt).toBeDefined();
    });

    test("TestIniciarSesionContrasenaIncorrecta", async () => {
        const peticion = { correoElectronico: "kikgamboa@gmail.com", contrasena: "Contrasena2" };

        const response = await request(app).post("/api/autenticacion").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
    });

    test("TestIniciarSesionCorreoInexistente", async () => {
        const peticion = { correoElectronico: "correoInexistente@inexistente.com", contrasena: "Contrasena1" };

        const response = await request(app).post("/api/autenticacion").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
    });
});