const base64Encode = require('../server/services/util.service').base64Encode;

const run = ({describe, request, it, expect, accessToken, moduleName, newData, updateData, validateFieldsException = []}) => {
    const model = require('../server/models')[moduleName];
    const validateFields = Object.keys(model.tableAttributes);
    var createdData = {};

    const validate = (res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equal(true);
        expect(res.body).to.have.property('data');
        const data = parse(res.body.data[0]);
        return data;
    }

    const parse = data => {
        const decimalFields = validateFields.filter(name => model.tableAttributes[name].type.constructor.key === 'DECIMAL');
        let result = {};

        Object.keys(data).map(name => {
            if (decimalFields.includes(name))
                result[name] = parseFloat(data[name]); // chai.request will return decimal as string, so use this to convert
            else
                result[name] = data[name];
        })

        return result;
    }

    describe(`Create ${moduleName}`, () => {
        it('it should have success with data', done => {
            request()
                .post(`/api/${moduleName}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', accessToken)
                .send(newData)
                .end((err, res) => {
                    let resData = validate(res);
                    expect(Object.keys(resData)).to.include.members(validateFields);
                    
                    Object.keys(newData).filter(name => !validateFieldsException.includes(name)).map(name => {
                        expect(resData[name]).to.equal(newData[name]);
                    });

                    createdData = resData;
                    done();
                });
        });
    })

    describe(`Get new ${moduleName}`, () => {
        it('it should have success with data', done => {
            let param = {
                con: {
                    id: createdData.id
                }
            };

            param = base64Encode(JSON.stringify(param));
    
            request()
                .get(`/api/${moduleName}/${param}`)
                .set('Authorization', accessToken)
                .end((err, res) => {
                    let resData = validate(res);
                    expect(Object.keys(resData)).to.include.members(validateFields);
                    
                    Object.keys(newData).map(name => {
                        expect(resData[name]).to.equal(createdData[name]);
                    });

                    done();
                });
        });
    })

    describe(`Update ${moduleName}`, () => {
        it('it should have success with rowUpdate', done => {
            let param = {
                attr: updateData,
                con: {
                    id: createdData.id
                }
            };
            
            request()
                .put(`/api/${moduleName}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', accessToken)
                .send(param)
                .end((err, res) => {
                    let resData = validate(res);
                    expect(resData).to.have.property('rowUpdate');
                    expect(resData.rowUpdate).to.equal(1);
                    done();
                });
        });
    })

    describe(`Get updated ${moduleName}`, () => {
        it('it should have success with data', done => {
            let param = {
                con: {
                    id: createdData.id
                }
            };

            param = base64Encode(JSON.stringify(param));
    
            request()
                .get(`/api/${moduleName}/${param}`)
                .set('Authorization', accessToken)
                .end((err, res) => {
                    let resData = validate(res);
                    expect(Object.keys(resData)).to.include.members(validateFields);
                    
                    Object.keys(updateData).map(name => {
                        expect(resData[name]).to.equal(updateData[name]);
                    })

                    done();
                });
        });
    })

    describe(`Delete ${moduleName}`, () => {
        it('it should have success with rowDelete', done => {
            let param = {
                con: {
                    id: createdData.id
                }
            };
            
            request()
                .delete(`/api/${moduleName}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', accessToken)
                .send(param)
                .end((err, res) => {
                    let resData = validate(res);
                    expect(resData).to.have.property('rowDelete');
                    expect(resData.rowDelete).to.equal(1);
                    done();
                });
        });
    })
}

module.exports = {
    run
}