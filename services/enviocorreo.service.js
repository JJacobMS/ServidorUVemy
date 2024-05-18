const dotenv = require('dotenv');
const crypto = require('crypto');
const transporter = require('../config/nodemailer');

dotenv.config();

const generarCodigo = () => {
    const buf = crypto.randomBytes(2); 
    const num = buf.readUInt16BE(0); 
    return (num % 10000).toString().padStart(4, '0');
}

const enviarCorreoVerificacion = async (correoElectronicoDestinatario) => {
    const codigoVerificacion = generarCodigo();

    await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: correoElectronicoDestinatario,
        subject: 'Código de verificación',
        text: `Su código de verificación es: ${codigoVerificacion}`
    });

    return codigoVerificacion;
}

module.exports = enviarCorreoVerificacion;