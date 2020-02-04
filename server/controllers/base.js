'use strict';

const db = require('../models');

class BaseController {
    constructor(model) {
        this._model = model;        
        this.create = this.create.bind(this);
        this.bulkCreate = this.bulkCreate.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.setCondition = this.setCondition.bind(this);
        this.associationList = [];

        Object.keys(model.associations).forEach(key => {
            let obj = {
                model: db[key],
                as: key
            };

            this.associationList.push(obj);            
        });
    }

    create(param, callback) {
        db.sequelize.transaction().then(t => {
            this._model.create(param, {                
                include: this.associationList,
                transaction: t
            }).then(function(result) {
                t.commit();
                callback(null, [result]);
            }).catch(function(err) {
                t.rollback();
                callback(err, null);
            });        
        });
    }

    bulkCreate(param, callback) {
        db.sequelize.transaction().then(t => {
            this._model.bulkCreate(param, {                
                // include: this.associationList,
                transaction: t
            }).then(function(result) {
                t.commit();
                callback(null, result);
            }).catch(function(err) {
                t.rollback();
                callback(err, null);
            });        
        });
    }

    setCondition(value, op) {
        const Op = db.Sequelize.Op;
        
        if (op && op !== '') {
            switch(op) {
                case 'like':
                    return {[Op.like]: `%${value}%`}

                default:
                    return {[Op[op]]: value}
            }
        }
        else
            return value;
    }

    get(param, callback) {
        var attr = '';
        var condition = '';
        var con = {};
        var inc = [];

        if (Object.keys(param).length !== 0) {        
            condition = param['con'];
            
            // Retreiving fields (master)
            if (typeof param['attr'] !== 'undefined' && param['attr'].length > 0) attr = param['attr'];

            // Conditions            
            if (typeof condition !== 'undefined' && !condition.length) {                
                Object.keys(condition).forEach(name => {                
                    //let dataType = this._model.tableAttributes[name].type.key;                    
                    let paramValue = '';
                    //let searchLike = false;
                    let op = '';
                    
                    if (typeof condition[name] !== 'object') paramValue = condition[name];
                    else {
                        condition[name].hasOwnProperty('value') ? paramValue = condition[name].value : null;
                        condition[name].hasOwnProperty('op') ? op = condition[name].op : null;                                            
                    }

                    if (paramValue !== null && paramValue !== '')
                            con[name] = this.setCondition(paramValue, op);
                });
            }
            
            // Include associations
            let filter = param['include'];

            if (typeof filter !== 'undefined' && !filter.length) { 
                Object.keys(filter).forEach(key => {
                    let item = this.associationList.filter(item => item.as === key);
                    if (typeof item !== 'undefined' && item.length > 0) {                        
                        if (typeof filter[key] !== 'undefined' && filter[key].length > 0) item[0].attributes = filter[key];
                        inc.push(item[0]);
                    }
                });
            }
        }
        
        this._model.findAll({
            attributes: attr,
            where: con,
            // where: {
            //     username: {
            //         '$like': '%ad%'
            //     }
            // },
            include: inc
        }).then(function(result) {
            callback(null, result);
        }).catch(function(err) {
            callback(err, null);
        });               
    }
    
    update(param, callback) {
        if (Object.keys(param).length !== 0) {
            var con = {};
            var attr = param['attr'];
            var condition = param['con'];

            // Conditions            
            if (typeof condition !== 'undefined' && !condition.length) {                
                Object.keys(condition).forEach(name => {                
                    con[name] = condition[name];
                });
            }

            this._model.update(attr, {
                where: con
            }).then(function(result) {
                let rowUpdate = result[0];
                callback(null, [{"rowUpdate": rowUpdate}]);
            }).catch(function(err) {
                callback(err, null);
            });
        }
    }

    delete(param, callback) {
        if (Object.keys(param).length !== 0) {
            var con = {};
            var condition = param['con'];

            // Conditions            
            if (typeof condition !== 'undefined' && !condition.length) {                
                Object.keys(condition).forEach(name => {                
                    con[name] = condition[name];
                });
            }

            this._model.destroy({
                where: con
            }).then(function(result) {
                let rowDelete = result;
                callback(null, [{"rowDelete": rowDelete}]);
            }).catch(function(err) {
                callback(err, null);
            });
        }
    }

    callMethod(method, params, res) {
        const response = require('../services/util.service');
        var param = params && ((Array.isArray(params) && params.length > 0) || Object.keys(params).length > 0) ? JSON.parse(params) : {};
        
        if (method === 'create' && Array.isArray(param))
            method = 'bulkCreate';
        
        return this[method](param, (err, result) => {
            if (err) {
                response.ReE(res, err, res.statusCode);
            }
            else {
                response.ReS(res, result, res.statusCode);
            }
        });
    }
}

module.exports = BaseController;