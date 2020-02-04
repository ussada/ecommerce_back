module.exports = (app) => {
    const auth = require('../controllers/auth');
    
    app.get('/api', (req, res) => {
        return res.status(200).send({
            message: 'Welcome to my API'
        });
    });        

    app.post('/api/auth/login', auth.login);
    app.post('/api/auth/refresh', auth.refresh);
    app.post('/api/auth/logout', auth.logout);

    app.use(['/api/:name/:param', '/api/:name'], auth.requireJwtAuth, (req, res) => {
        const {restrictController, controllerList} = require('../config/global');
        const response = require('../services/util.service');

        // Verify controller
        if (!restrictController || controllerList.indexOf(req.params.name) > -1) {
            const controller = require('../controllers')(req.params.name);
            
            switch(req.method) {
                case "GET": 
                    controller.callMethod('get', req.params.param, res);
                    break;
                case "POST":
                    controller.callMethod('create', req.body.param, res);
                    break;
                case "PUT":
                    controller.callMethod('update', req.body.param, res);
                    break;
                case "DELETE":
                    controller.callMethod('delete', req.body.param, res);
                    break;
            }
        }
        else response.ReE(res, 'Module not found', 404);
    });    
};