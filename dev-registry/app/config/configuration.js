const nconf = require('nconf');

nconf.argv().env();
nconf.file('responseMessage', __basePath + 'app/config/responseMessage.json');

module.exports = nconf;