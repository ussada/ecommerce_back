module.exports.ReE = function(res, err, code){ // Error Web Response
    if(typeof err == 'object' && typeof err.message != 'undefined'){
        err = err.message;
    }

    if(typeof code !== 'undefined') res.statusCode = code;
    else res.statusCode = 422;

    return res.json({success:false, error: err});
};

module.exports.ReS = function(res, data, code){ // Success Web Response
   return res.json({"success": true, "data": data});
};

module.exports.validRequireFields = function (input, fields) {
    if (typeof fields === 'string') {
        fields = [fields];
    }

    let errors = [];
    let inputFields = Object.keys(input);
    let errorFields = fields.filter(item => !inputFields.includes(item));
    errorFields.forEach(item => errors.push(`Missing field "${item}"`));

    return errors.length === 0 ? null : errors;
};

const bcrypt = require('bcrypt');

exports.cryptPassword = function(password) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err)
                return reject(err);

            return resolve(hash);
        })
    });
};
 
exports.comparePassword = function(passPlain, passHash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(passPlain, passHash, function(err, isPasswordMatch) {
            if (err)
                return reject(err);

            return resolve(isPasswordMatch);
        });
    })
};

exports.base64Encode = (s) => {
    return new Buffer(s).toString('base64');
  }
  
exports.base64Decode = (s) => {
    return new Buffer(s, 'base64').toString('ascii');
}