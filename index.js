const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

var bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
    origin : [ "http://localhost:3001", "http://localhost:8080" ],
    methods: "GET,PUT,POST,DELETE",
};

//app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(cors(corsOptions));
app.use("/api/cursos", require('./routes/cursos.routes'))
app.use("/api/clases", require('./routes/clases.routes'))
app.use("/api/documentos", require('./routes/documentos.routes'))
app.use("/api/tiposarchivos", require('./routes/tiposarchivos.routes'))
app.use("/api/autenticacion", require('./routes/autenticacion.routes'))

const errorLogger = require('./middlewares/errorlogger.middleware');
const errorHandler = require('./middlewares/errorhandler.middleware');
app.use(errorLogger, errorHandler);


app.get('*', (req, res) => {res.status(404).send()});
    const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    });  
    async function getConexion(){
        try {
          const [rows,fields] = await pool.query('SELECT NOW() AS currentTime')
          console.log(rows);
          return rows;
        } catch (error) {
            console.log(error);
        }}
getConexion();
app.listen(process.env.SERVER_PORT,()=>{
    console.log('Aplicacion de ejemplo escuchando en el puerto '+process.env.SERVER_PORT);
});


//gRPC

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./proto/documento.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const documentoProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const { enviarVideoClase } = require('./services/videogrpc.service');
server.addService(documentoProto.VideoService.service, { EnviarVideoClase : enviarVideoClase});

server.bindAsync(`localhost:${process.env.SERVER_PORT_GRPC}`, grpc.ServerCredentials.createInsecure(), ()=>{
    console.log(`Servidor gRPC en ejecución en el puerto ${process.env.SERVER_PORT_GRPC}`)
});
