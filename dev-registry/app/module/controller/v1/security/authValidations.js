const joi               = require('joi');
const underscore        = require('underscore');
const constant          = require(__basePath + 'app/config/constant');
const validationHelper  = require(constant.path.app + 'util/validation');
const { writeLogInfo, writeLogErrorTrace } = require(constant.path.app + 'util/logger');
const exception         = require(constant.path.app + 'core/exception');


exports.verifyAccessToken = ( req, res, next ) => {
    writeLogInfo([' [verifyAccessToken]','[validation] called for ', req.headers ]);

    const schema = joi.object().keys({
        headers : joi.object().keys({
            "codist-access-token" : joi.string().required()
        }).unknown(true),
        body    : joi.object().keys({}),
        params  : joi.object().keys({}),
        query   : joi.object().keys({})
    });

    let result = schema.validate({
        query   : req.query,
        body    : req.body,
        params  : req.params
    }, validationHelper.validationDefaultObject);

    underscore.extend(req, result.value);
    return result.error ? next(new exception.ValidationErrorException(validationHelper.parseError(result.error))) : next();
}