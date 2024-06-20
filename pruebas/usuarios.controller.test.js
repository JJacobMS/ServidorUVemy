const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(1, 'admin@gmail.com', 'Sulem');

describe("GET /api/usuarios/1", function(){
    test("TestObtenerUsuariosPagina1", async () => {
        const response = await request(app).get("/api/usuarios/1").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
      });
})

describe("GET /api/usuarios/12", function(){
    test("TestObtenerUsuariosPagina2", async () => {
        const response = await request(app).get("/api/usuarios/2").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
      });
})