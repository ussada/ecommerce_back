module.exports = (app) => {
    const auth = require('../controllers/auth');
    const base64Decode = require('../services/util.service').base64Decode;
    
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
                    let param;
                    
                    if (req.params.param) {
                        try {
                            param = JSON.parse(base64Decode(req.params.param));
                            // param = JSON.parse(req.params.param);
                        }
                        catch (e) {
                            param = '';
                        }
                    }
                    else
                        param = '';

                    controller.callMethod('get', param, res);
                    break;
                case "POST":
                    controller.callMethod('create', req.body, res);
                    break;
                case "PUT":
                    controller.callMethod('update', req.body, res);
                    break;
                case "DELETE":
                    controller.callMethod('delete', req.body, res);
                    break;
            }
        }
        else response.ReE(res, 'Module not found', 404);
    });    
};