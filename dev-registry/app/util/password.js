const crypto        = require('crypto');
const saltLength    = 32;

function createHash(password) {
    let salt = generateSalt(saltLength);
    let hash = md5(password + salt);
    return salt + hash;
}

function validateHash(hash, password) {
    let salt        = hash.substr(0, saltLength);
    let validHash   = salt + md5(password + salt);
    return hash === validHash;
}

function generateSalt(len) {
    let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    let setLen = set.length;
    let salt = '';

    for (let i = 0; i < len; i++) {
        let p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }

    return salt;
}

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

function randomPassword(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

module.exports = {
    hash        : createHash,
    validateHash    : validateHash,
    randomPassword
};