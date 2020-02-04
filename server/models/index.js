'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.js')[env];
var db = {};

// const Op = Sequelize.Op;
// const operatorsAliases = {
//   $like: Op.like,
//   $not: Op.not
// }

var sequelize = void 0;
// sequelize = new Sequelize({...config, operatorsAliases});
sequelize = new Sequelize(config);

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var name = file.substring(0, file.lastIndexOf("."));

        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;