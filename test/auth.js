const login = ({request, it, expect}, callback) => {
    it('it should have success with token', done => {
        let param = {
            username: 'admin',
            password: 'admin'
        };
        
        request()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(param)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.equal(true);
                expect(res.body.data).to.have.property('token');
                expect(res.body.data.token).to.have.any.keys('accessToken', 'refreshToken', 'expiresIn');
                expect(res.body.data).to.have.property('user');
                let result = JSON.parse(res.text);
                let accessToken = result.data.token.accessToken;
                let user_id =result.data.user.id;
                callback({accessToken, user_id});
                done();
            });
    });
}

const logout = ({request, it, expect, user_id}) => {
    it('it should have success with Logout successful', done => {
        let param = {
            user_id
        };
        
        request()
            .post('/api/auth/logout')
            .set('Content-Type', 'application/json')
            .send(param)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.equal(true);
                expect(res.body.data).to.equal('Logout successful');
                done();
            });
    });
}

module.exports = {
    login,
    logout
}