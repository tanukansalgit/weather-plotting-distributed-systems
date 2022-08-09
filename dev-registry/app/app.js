const cors       = require('cors');
const helmet     = require('helmet');
const app        = require('express')();
const bodyParser = require('body-parser');
const constant   = require(__basePath + 'app/config/constant');
const exception  = require(constant.path.app + 'util/exception');

// load env variables
require('dotenv').config();

/*
 * @description Middlewares for parsing body
 */
app.use(cors({
    origin  : '*',
    headers : process.env.CORS_HEADERS.split(",") || '*',
    methods : ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE']
}));

app.use(helmet());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/*
 * Injecting all dependencies Modules + common libs
 */
require(constant.path.app + 'config/dependency')(app);

/*
 * @description Catch 404 error if no route found
 */
app.use(exception.unknownRouteHandler);

/*
 * @description Error handler
 */
app.use(exception.errorHandler);

module.exports = app;
