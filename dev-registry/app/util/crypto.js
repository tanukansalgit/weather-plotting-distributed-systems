const crypto = require('crypto');
const constant = require(__basePath + 'app/config/constant');

/**
 * Encrypt Data
 * @method
 * @param {String} plainText
 * @param {String} workingKey
 * @param {String} iv
 * @return {String}
 */
const encrypt = function (plainText, workingKey, iv) {
	let m = crypto.createHash('md5');
    m.update(workingKey);
   	let key = m.digest('buffer');
	let cipher = crypto.createCipheriv(constant.crypto.algo, key, iv);
	let encoded = cipher.update(plainText, constant.crypto.encoding, constant.crypto.digest);
	encoded += cipher.final(constant.crypto.digest);
    return encoded;
};

/**
 * Decrypt Data
 * @method
 * @param {String} encryptedText
 * @param {String} workingKey
 * @param {String} iv
 * @return {String}
 */
const decrypt = function (encText, workingKey, iv) {
    let m = crypto.createHash('md5');
    m.update(workingKey)
    let key = m.digest('buffer');
	let decipher = crypto.createDecipheriv(constant.crypto.algo, key, iv);
    let decoded = decipher.update(encText, constant.crypto.digest, constant.crypto.encoding);
	decoded += decipher.final(constant.crypto.encoding);
    return decoded;
};

module.exports = {
    encrypt,
    decrypt
};