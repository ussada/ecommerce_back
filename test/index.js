const chai = require('chai');
const chaiHttp = require('chai-http');
const {after, before, describe, it} = require('mocha');
const server = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

var accessToken = '';
var user_id = 0;

const request = () => {
    return chai.request(server);
}

const executeTest = (name, testFunc, options = {}, callback) => {
    describe(name, () => testFunc({request, describe, it, expect, accessToken, user_id, ...options}, callback));
}

const authModule = require('./auth');
const baseTestModule = require('./base').run;
const testModules = require('./testData');

describe('Testing units', () => {
    executeTest('Login', authModule.login, '',  res => {
        accessToken = res.accessToken;
        user_id = res.user_id;

        testModules.map(moduleOptions => {
            let moduleName = moduleOptions.moduleName;
            let name = moduleName[0].toUpperCase() + moduleName.slice(1);
            executeTest(`${name} Module`, baseTestModule, moduleOptions);
        })
    });
    
    after(done => {
        executeTest('Logout', authModule.logout);
        done();
    })
});