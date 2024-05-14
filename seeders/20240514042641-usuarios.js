'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('usuarios', [
      { correoElectronico: 'ejemplo@gmail.com', contrasena: await bcrypt.hash('hola', 10), nombres: 'Ejemplo', apellidos: 'Ejemplo', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
