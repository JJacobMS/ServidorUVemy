const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken, generarTokenRegistro } = require('../services/jwttoken.service');

const CODIGO_VERIFICACION = 1234;
const CORREO_NO_REGISTRADO = 'egamboa020903@gmail.com';
const CORREO_REGISTRO = 'pruebas@uvemy.com';
const CORREO_YA_REGISTRADO = 'kikgamboa@gmail.com';
const TOKEN_REGISTRO = generarTokenRegistro(CORREO_REGISTRO, CODIGO_VERIFICACION);
const TOKEN_REGISTRO_CORREO_YA_REGISTRADO = generarTokenRegistro(CORREO_YA_REGISTRADO, CODIGO_VERIFICACION);
const TOKEN = generaToken(4, 'kikgamboa@gmail.com', 'Contrasena1');
const TOKEN_ID_USUARIO_INEXISTENTE = generaToken(100, 'correo@gmail.com', 'Usuario inexistente');
const TOKEN_USUARIO_SIN_FOTO = generaToken(8, 'zs21013858@estudiantes.uv.mx', 'prueba');

describe("POST /api/perfil/verificacion", function(){

    test("TestSolicitarCodigoVerificacionCorreoExito", async () => {
        const peticion = { correoElectronico: CORREO_NO_REGISTRADO };
        const response = await request(app).post("/api/perfil/verificacion").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.jwt).toBeDefined();
    });

    test("TestSolicitarCodigoVerificacionCorreoYaRegistrado", async () => {
        const peticion = { correoElectronico: CORREO_YA_REGISTRADO }
        const response = await request(app).post("/api/perfil/verificacion").send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("Correo electrónico ya registrado");
    });
});

describe("POST /api/perfil/registro", function(){
    
    test("TestRegistrarUsuarioCodigoVerificacionIncorrecto", async () => {
        const peticion = {
            nombres: "Pruebas",
            apellidos: "Pruebas",
            correoElectronico: CORREO_REGISTRO,
            contrasena: "Contrasena1",
            idsEtiqueta: [1, 2],
            codigoVerificacion: 4321
        };
        const response = await request(app).post("/api/perfil/registro").set('Authorization', `Bearer ${TOKEN_REGISTRO}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
    });

    test("TestRegistrarUsuarioExito", async () => {
        const peticion = { 
            nombres: "Pruebas",
            apellidos: "Pruebas",
            correoElectronico: CORREO_REGISTRO,
            contrasena: "Contrasena1",
            idsEtiqueta: [1, 2],
            codigoVerificacion: CODIGO_VERIFICACION
        };
        const response = await request(app).post("/api/perfil/registro").set('Authorization', `Bearer ${TOKEN_REGISTRO}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.CREATED);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idUsuario).toBeDefined();
    });

    test("TestRegistrarUsuarioCorreoYaRegistrado", async () => {
        const peticion = {
            nombres: "Pruebas",
            apellidos: "Pruebas",
            correoElectronico: CORREO_YA_REGISTRADO,
            contrasena: "Contrasena1",
            idsEtiqueta: [1, 2],
            codigoVerificacion: CODIGO_VERIFICACION
        };
        const response = await request(app).post("/api/perfil/registro").set('Authorization', `Bearer ${TOKEN_REGISTRO_CORREO_YA_REGISTRADO}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("Correo electrónico ya registrado");
    });
});

describe("PUT /api/perfil/foto", function(){

    test("TestSubirFotoPerfilUsuarioExito", async () => {
        const response = await request(app).put("/api/perfil/foto").field('idUsuario', 4)
        .set('Authorization', `Bearer ${TOKEN}`).attach('imagen', `${__dirname}\\documentosprueba\\fotoPrueba.png`);

        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.idUsuario).toBeDefined();
        expect(response.body.detalles).toContain("Foto de perfil actualizada");
    });

    test("TestSubirFotoPerfilUsuarioIdUsuarioDiferenteToken", async () => {
        const response = await request(app).put("/api/perfil/foto").field('idUsuario', 100)
        .set('Authorization', `Bearer ${TOKEN}`).attach('imagen', `${__dirname}\\documentosprueba\\fotoPrueba.png`);

        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
    });

    test("TestSubirFotoPerfilUsuarioInexistente", async () => {
        const response = await request(app).put("/api/perfil/foto").field('idUsuario', 100)
        .set('Authorization', `Bearer ${TOKEN_ID_USUARIO_INEXISTENTE}`).attach('imagen', `${__dirname}\\documentosprueba\\fotoPrueba.png`);

        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("Usuario no encontrado");
    });
});

describe("PUT /api/perfil", function(){

    test("TestActualizarPerfilUsuarioConContrasenaExito", async () => {
        const peticion = {
            idUsuario: 4,
            nombres: "Nombre PUT Actualizar Perfil",
            apellidos: "Apellido PUT Actualizar Perfil",
            correoElectronico: "kikgamboa@gmail.com",
            contrasena: "Contrasena2"
        }
        const response = await request(app).put("/api/perfil").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
    });

    test("TestActualizarPerfilUsuarioSinContrasenaExito", async () => {
        const peticion = {
            idUsuario: 4,
            nombres: "Actualizar Perfil",
            apellidos: "Sin contraseña",
            correoElectronico: "kikgamboa@gmail.com"
        }
        const response = await request(app).put("/api/perfil").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
    });

    test("TestActualizarPerfilIdUsuarioDiferenteToken", async () => {
        const peticion = {
            idUsuario: 100,
            nombres: "Actualizar Perfil",
            apellidos: "idUsuario de Token distinto al del body",
            correoElectronico: "kikgamboa@gmail.com"
        }
        const response = await request(app).put("/api/perfil").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("IdUsuario no coincide con el token");
    });

    test("TestActualizarPerfilUsuarioInexistente", async () => {
        const peticion = {
            idUsuario: 100,
            nombres: "Actualizar Perfil",
            apellidos: "Usuario inexistente",
            correoElectronico: "correo@gmail.com"
        }
        const response = await request(app).put("/api/perfil").set('Authorization', `Bearer ${TOKEN_ID_USUARIO_INEXISTENTE}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
        expect(response.body.detalles).toContain("No existe el usuario");
    });

    test("TestActualizarPerfilCorreo", async () => {
        const peticion = {
            idUsuario: 4,
            nombres: "Actualizar Perfil",
            apellidos: "Correo",
            correoElectronico: "otroCorreo@gmail.com"
        }
        const response = await request(app).put("/api/perfil").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("No se puede cambiar el correo electrónico");
    });
});

describe("PUT /api/perfil/usuarioetiquetas", function() {

    test("TestActualizarEtiquetasUsuarioExito", async () => {
        const peticion = {
            idUsuario: 4,
            idsEtiqueta: [3, 5]
        }
        const response = await request(app).put("/api/perfil/usuarioetiquetas").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
    });

    test("TestActualizarEtiquetasUsuarioIdUsuarioDiferenteToken", async () => {
        const peticion = {
            idUsuario: 100,
            idsEtiqueta: [3, 5]
        }
        const response = await request(app).put("/api/perfil/usuarioetiquetas").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
        expect(response.body.detalles).toContain("IdUsuario no coincide con el token");
    });

    test("TestActualizarEtiquetasUsuarioInexistente", async () => {
        const peticion = {
            idUsuario: 100,
            idsEtiqueta: [3, 5]
        }
        const response = await request(app).put("/api/perfil/usuarioetiquetas").set('Authorization', `Bearer ${TOKEN_ID_USUARIO_INEXISTENTE}`).send(peticion);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
        expect(response.body.detalles).toContain("No existe el usuario");
    });
});

describe("GET /api/perfil/foto", function(){
    
    test("TestObtenerFotoPerfilExito", async () => {
        const response = await request(app).get("/api/perfil/foto").set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("image/png"));
    });

    test("TestObtenerFotoPerfilUsuarioInexistente", async () => {
        const response = await request(app).get("/api/perfil/foto").set('Authorization', `Bearer ${TOKEN_ID_USUARIO_INEXISTENTE}`);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
        expect(response.body.detalles).toContain("Usuario no encontrado");
    });

    test("TestObtenerFotoPerfilSinFoto", async () => {
        const response = await request(app).get("/api/perfil/foto").set('Authorization', `Bearer ${TOKEN_USUARIO_SIN_FOTO}`);
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });
});