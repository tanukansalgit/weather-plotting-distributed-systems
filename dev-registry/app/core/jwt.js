const crypto        = require('crypto');
const promise       = require('bluebird');
const jwtEngine     = require('jsonwebtoken');

class Jwt {

    constructor () {
        this.secretKey = '2555501c-0468-40bf-9a7d-7acb484ac1ce'
    }
    
    _encryptString (plaintext, secretKey) {
        let cipher = crypto.createCipher('aes-256-cbc', secretKey);
        return cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64');
    };

    _decryptString (plaintext, secretKey) {
        let decipher = crypto.createDecipher('aes-256-cbc', secretKey);
        return decipher.update(plaintext, 'base64', 'utf8') + decipher.final('utf8');
    };

    sign (data, secret, options) {
        data = this._encryptString(JSON.stringify(data), this.secretKey);
        return jwtEngine.sign({data: data}, secret, options);
    }

    verify (token, secret) {
        let _this = this;
        return jwtEngine.verify(token, secret, function(err, decoded) {
            if (err) {
                return promise.reject(err);
            }

            let decodedData = _this._decryptString(decoded.data, _this.secretKey);
            return promise.resolve(JSON.parse(decodedData));
        });
    }
};


module.exports = Jwt;