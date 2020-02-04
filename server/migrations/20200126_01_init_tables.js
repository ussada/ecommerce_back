module.exports = {
    up: (queryInterface, Sequelize) => {
      var models = require('../models');

      return models.sequelize.sync()
        .catch(err => {
            console.log(err, 'DB NG');
        });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropAllTables();
    }
  };