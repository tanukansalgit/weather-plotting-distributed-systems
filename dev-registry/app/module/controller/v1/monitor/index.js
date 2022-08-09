const constant = require(__basePath + 'app/config/constant');
const router = require('express').Router({ caseSensitive: true, strict: true});
const monitor = require(constant.path.moduleV1 + '/monitor/monitorController');

// check server health
router.get('/ping', monitor.ping);

module.exports = {
    router : router
}