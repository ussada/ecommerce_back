'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
// var https = require('https');
var compression = require('compression');
var cors = require('cors');

var app = express();
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//var router = express.Router();
//app.use('/api', router);

// var models = require('./server/models');

// models.sequelize.sync().then(function () {
//     console.log('DB OK');
// }).catch(function (err) {
//     console.log(err, 'DB NG');
// });

// var fs = require('fs');
// var privateKey  = fs.readFileSync('cert.key');
// var certificate = fs.readFileSync('cert.pem');

// var credentials = {key: privateKey, cert: certificate};

app.options('*', cors());

app.use((req, res, next) => {
    //res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', ['*']);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    //res.mode('')
    next();
});

require('./server/routes')(app);
app.get('/', function (req, res) {
    return res.status(200).send({
        message: 'Welcome'
    });
});

var httpPort = 3000;
var httpServer = http.createServer(app);
httpServer.listen(httpPort, () => console.log('HTTP server start on port ' + httpPort));

// var httpsPort = 3005;
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(httpsPort, () => console.log('HTTPS server start on port ' + httpsPort));

module.exports = httpServer;