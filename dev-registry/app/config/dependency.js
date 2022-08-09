const express         = require('express');
const cookieParser    = require('cookie-parser');
const constant        = require(__basePath + 'app/config/constant');
const publicDir       = require('path').join(constant.path.app,'/public');
const { getDbConnection } = require(constant.path.app + 'util/mongo')


 // Connect to database
getDbConnection();

module.exports = (app) => {
    app.use(cookieParser());
    app.use(express.static(publicDir));
    
    //Registring Controller Modules
    app.use('/registry/api/v1/monitor', require(constant.path.module + 'v1/monitor').router);
    app.use('/registry/api/v1/user', require(constant.path.module + 'v1/user').router);
    app.use('/registry/api/v1/security', require(constant.path.module + 'v1/security').router);
    app.use('/registry/api/v1/upload', require(constant.path.module + 'v1/uploadDocument').router);
};