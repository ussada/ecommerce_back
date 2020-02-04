'use strict';

module.exports = (controller) => {
    const fs = require('fs');
    var path = require('path');
    const file = path.join(__dirname, controller + '.js');

    if (fs.existsSync(file)) {
        var controllerFile = controller;
    }
    else {
        var controllerFile = 'base';
    };
    
    const model = require('../models');
    const Controller = require('./'+controllerFile);
    const modelController = new Controller(model[controller]);
    return modelController;
};