'use strict';

const response = require('../services/util.service');
const userController = require('./')('user');
const userSessionController = require('./')('user_session');
const useAuth = require('../config/global').useAuth;
const comparePassword = require('../services/util.service').comparePassword;
const extractJwt = require('passport-jwt').ExtractJwt;
// declare strategy
const jwtStrategy = require('passport-jwt').Strategy;
// define strategy
const jwtOptions = {
    jwtFromRequest: extractJwt.fromHeader('authorization'),
    secretOrKey: require('../config/global').secretKey
};
const jwtAuth = new jwtStrategy(jwtOptions, (payload, done) => {
    const currTime = new Date().getTime();

    if (currTime > payload.exp) {
        return done(null, {
            success: false,
            error: 'Token expired'
        })
    }
    else {
        const con = {
            con: {
                username: {
                    value: payload.sub,
                    // op: 'like'
                },
                user_status: 'A'
            }
        };

        userController.get(con, (err, result) => {
            if (err) {
                return done(err, false);
            }
            else if (typeof result !== 'undefined' && result.length > 0) {
                return done(null, {
                    success: true,
                    data: result
                });
            }
            else {
                return done(null, {success: false});
            }
        });
    }
});

// declare passport
const passport = require('passport');
// add strategy to passport
passport.use(jwtAuth);
// declare passport middleware
const requireJwtAuth = (req, res, next) => {
    return passport.authenticate('jwt', {session:false}, (err, result, info) => {
        if (useAuth) {
            if (err) {
                return next(err);
            }
            if (!result) {
                return res.json({
                    success: false,
                    error: 'Unauthorized user'
                });
            }

            if (!result.success) {
                return res.json({
                    success: false,
                    error: result.error
                });
            }

            req.user = result.data;
        }

        next();
    })(req, res, next);
};

const generateToken = (username) => {
    const jwt = require('jsonwebtoken');
    const secretKey = require('../config/global').secretKey;
    const tokenExpiresIn = require('../config/global').tokenExpiresIn || 60;
    const payload = {
        sub: username,
        iat: new Date().getTime()
    }
    const token = jwt.sign(payload, secretKey, {expiresIn: tokenExpiresIn * 1000});
    return {accessToken: token, expiresIn: tokenExpiresIn};
}

const login = (req, res) => {
    const {username, password} = req.body;
    const con = {
        con: {
            username,
            // passwd: req.body.password,
            user_status: 'A'
        }
    };

    userController.get(con, (err, result) => {
        if (err) response.ReE(res, err, res.statusCode);
        else {
            if (typeof result === 'undefined' || result === null || result.length === 0) response.ReE(res, 'Login failed', 401);
            else {
                comparePassword(password, result[0].passwd)
                    .then(match => {
                        if (match) {
                            const {accessToken, expiresIn} = generateToken(username);
                            const randToken = require('rand-token');
                            const refreshToken = randToken.uid(128);
                            const refreshTokenExpiresIn = require('../config/global').refreshTokenExpiresIn;
                            let expires_in = new Date().getTime() + (refreshTokenExpiresIn * 1000);
                            const user = {
                                id: result[0].id,
                                full_name: result[0].full_name,
                                username: result[0].username,
                                role_id: result[0].role_id
                            }
                            
                            let loginResult = {
                                user,
                                token: {
                                    accessToken,
                                    refreshToken,
                                    expiresIn
                                }
                            }
                            
                            response.ReS(res, loginResult, res.statusCode);
            
                            let user_id = result[0].id;
            
                            // Delete existing refresh token
                            userSessionController.delete({con: {user_id}}, () => {
                                // Keep refresh token in db
                                const sessionParam = {
                                    user_id,
                                    expires_in,
                                    refresh_token: refreshToken
                                }
            
                                userSessionController.create(sessionParam, err => {
                                    if (err)
                                        console.log(err);
                                });
                            });
                        }
                        else
                            response.ReE(res, 'Incorrect password', 401);
                    })
                    .catch(err => {
                        response.ReE(err, 401);
                    })
            }                
        }
    });
}

const refresh = (req, res) => {
    let {user_id, refresh_token} = req.body;
    
    const con = {
        con: {
            user_id: user_id || 0,
            refresh_token: refresh_token || ' '
        }
    };

    userSessionController.get(con, (err, result) => {
        if (typeof result === 'undefined' || result.length === 0) response.ReE(res, 'Invalid token', 401);
        else {
            let currTime = new Date().getTime();
            let tokenExpiresIn = Number(result[0].expires_in);

            if (currTime > tokenExpiresIn) response.ReE(res, 'Token expires', 401);
            else {
                userController.get({con: {user_id}}, (err, userResult) => {
                    if (typeof userResult === 'undefined' || userResult === null || userResult.length === 0) response.ReE(res, 'User not found', 401);

                    const token = generateToken(userResult[0].username);
                    response.ReS(res, token, res.statusCode);
                });
            }
        }
    })
}

const logout = (req, res) => {
    let user_id = req.body.user_id;

    if (user_id && user_id > 0) {
        const con = {
            con: {
                user_id
            }
        };
    
        userSessionController.delete(con, (err, result) => {
            if (typeof result === 'undefined' || result.length === 0) response.ReE(res, 'Invalid token', 401);
            else {
                response.ReS(res, 'Logout successful', res.statusCode);
            }
        });
    }
    else
        response.ReE(res, 'Not found user', 404);
}

module.exports = {
    requireJwtAuth,
    login,
    refresh,
    logout
}