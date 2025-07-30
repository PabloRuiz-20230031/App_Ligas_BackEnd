const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarCorreo = async (para, asunto, mensaje) => {
  await transporter.sendMail({
    from: `"Ligas Municipales" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: asunto,
    text: mensaje
  });
};

module.exports = enviarCorreo;