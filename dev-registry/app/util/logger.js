const moment   = require('moment');
const winston  = require('winston');
const nodeEnv  = process.env.NODE_ENV || 'development';
const constant = require(__basePath + '/app/config/constant');

const logger = new (winston.Logger)({
    emitErrs  : false,
    transports: [
        new winston.transports.Console({
            level          : process.env.LOGGING_CONSOLE_LEVEL,
            label          : "CODIST",
            handleException: true,
            json           : false,
            colorize       : true,
            formatter      : function (options) {
                return "[" + moment().format('YYYY-MM-DD hh:mm:ss') + "] " +
                    options.label + "." + options.level.toUpperCase() + ": " + (options.message ?
                                                                                options.message :
                                                                                '') +
                    (options.meta && Object.keys(options.meta).length ?
                     '\n' + JSON.stringify(options.meta, null, 4) :
                     '');
            }
        }),

        new (winston.transports.File)({
            level          : process.env.LOGGING_FILE_LEVEL,
            label          : "registry",
            name           : 'log_file',
            filename       : constant.path.log + nodeEnv + '-' + moment().format('YYYY_MM_DD') + '.log',
            handleException: true,
            json           : false,
            maxSize        : 52428800,
            maxFiles       : 10,
            prettyPrint    : true,
            formatter      : function (options) {
                return "[" + moment().format('YYYY-MM-DD hh:mm:ss') + "] " +
                    options.label + "." + options.level.toUpperCase() + ": " + (options.message ?
                                                                                options.message :
                                                                                '') +
                    (options.meta && Object.keys(options.meta).length ?
                     '\n' + JSON.stringify(options.meta, null, 4) :
                     '');
            }
        })
    ]
});

const writeLogInfo = (arr) => {
   return logger.info(
       `${arr[0]} ${arr[1] || ''}`,
       arr[2] && JSON.stringify(arr[2])
   );
}

const writeLogError = (arr) => {
   return logger.error(
       `${arr[0]} ${arr[1] || ''}`,
       arr[2] && JSON.stringify(arr[2])
   );
}

const writeLogErrorStackTrace = (arr) => {
    return logger.error(
        `${arr[0]} ${arr[1] || ''}`,
        arr[2] && JSON.stringify(arr[2].stack)
    );
 }

/** Return Logger instances */
module.exports = {
    logger            : logger,
    writeLogInfo      : writeLogInfo,
    writeLogError     : writeLogError,
    writeLogErrorTrace: writeLogErrorStackTrace
};