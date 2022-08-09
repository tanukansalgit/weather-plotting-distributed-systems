const joi               = require('joi');
const underscore        = require('underscore');
const constant          = require(__basePath + 'app/config/constant');
const validationHelper  = require(constant.path.app + 'util/validation');
const { writeLogInfo, writeLogErrorTrace } = require(constant.path.app + 'util/logger');
const exception         = require(constant.path.app + 'core/exception');


exports.signUpValidation = ( req, res, next ) => {
    writeLogInfo([' [user signUp]','[validation] called for ', req.body]);

    const schema = joi.object().keys({
        headers : joi.object().keys({}),
        body    : joi.object().keys({
            'firstName' : joi.string().required(),
            'lastName'  : joi.string().required(),
            'email'     : joi.string().email().required(),
            'password'  : joi.string().required(),
        }).unknown(true),
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

exports.logInValidation = ( req, res, next ) => {
    writeLogInfo([' [user logIn]','[validation] called for ', req.body]);

    const schema = joi.object().keys({
        headers : joi.object().keys({}),
        body    : joi.object().keys({
            'email'     : joi.string().email().required(),
            'password'  : joi.string().required(),
        }).unknown(true),
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

exports.logOutValidation = ( req, res, next ) => {
    writeLogInfo([' [logout]','[validation] called for ', req.headers ]);

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


