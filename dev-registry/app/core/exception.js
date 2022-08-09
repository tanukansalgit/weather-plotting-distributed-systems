const constant      = require(__basePath + 'app/config/constant');
const config        = require(constant.path.app + 'config/configuration');
const NodeException = require("node-exceptions");
const underscore    = require("underscore");


//Services Exception
class ApplicationException extends NodeException.LogicalException {
    constructor(errorKey = "ERROR_SERVER_ERROR", messageVariables = {}) {
        super();

        const error   = config.get(`APP_MESSAGES:${errorKey}`);
        this.message  = underscore.template(error.message)(messageVariables);
        this.status   = error.statusCode;
        this.code     = error.errorCode;
        this.response = this.response || {};
    }
}


class AuthException extends ApplicationException {
    constructor() {
        super('ERROR_AUTHENTICATION');
    }
}

class InvalidCredentialsException extends ApplicationException {
    constructor() {
        super('ERROR_INVALID_CREDENTIALS');
    }
}

class UnsupportedServiceActionException extends ApplicationException {
    constructor() {
        super('ERROR_UNSUPPORTED_SERVICE');
    }
}

class DataNotFoundException extends ApplicationException {
    constructor() {
        super('ERROR_DATA_NOT_FOUND');
    }
}

class ClientConnectionTimeout extends ApplicationException {
    constructor() {
        super('ERROR_CONNECTION_TIMEOUT');
    }
}

class ValidationErrorException extends ApplicationException {
    constructor(response = {}) {
        super("ERROR_VALIDATION");
        this.response = response;
    }
}
class HeaderNotFoundException extends ApplicationException {
    constructor(response = {}) {
        super("ERROR_MISSING_HEADER");
        this.response = response;
    }
}

class UnrecognizedDeviceException extends ApplicationException {
    constructor(response = {}) {
        super("ERROR_UNRECOGNIZED_DEVICE");
        this.response = response;
    }
}

class InvalidEncryptionTokenException extends ApplicationException {
    constructor(response = {}) {
        super('INVALID_TOKEN');
        this.response = response;
    }
}
class UnauthorizedAccessException extends ApplicationException {
    constructor(response = {}) {
        super('ERROR_UNAUTHORIZED_ACCESS');
        this.response = response;
    }
}
class CacheConnectionException extends ApplicationException {
    constructor() {
        super('ERROR_CACHE_CONNECTION');
    }
}
class ImageNotUploadedException  extends ApplicationException {
    constructor() {
        super('ERROR_IMAGE_UPLOAD');
    }
}

/*
 * Error Handler 
 */
const errorHandler = function (err, req, res, next) {
    let errResponse = {
        status       : false,
        statusMessage: err.message,
        statusCode   : err.code,
        response     : err.response
    };

    return res.status(err.status || 500).json(errResponse);
};

class ModuleApiErrorException extends NodeException.LogicalException {
    constructor(result = {}) {
        super();
        this.message  = result.body.statusMessage;
        this.status   = result.statusCode;
        this.code     = result.body.statusCode;
        this.response = result.body.response || {};
    }
}

/*
 * Error Handler 
 */
const unknownRouteHandler = function (req, res, next) {
    return next(new UnsupportedServiceActionException);
};

module.exports = {
    InvalidCredentialsException                 : InvalidCredentialsException,
    ModuleApiErrorException                     : ModuleApiErrorException,
    DataNotFoundException                       : DataNotFoundException,
    ClientConnectionTimeout                     : ClientConnectionTimeout,
    ValidationErrorException                    : ValidationErrorException,
    AuthException                               : AuthException,
    HeaderNotFoundException                     : HeaderNotFoundException,
    UnrecognizedDeviceException                 : UnrecognizedDeviceException,
    InvalidEncryptionTokenException             : InvalidEncryptionTokenException,
    UnauthorizedAccessException                 : UnauthorizedAccessException,
    CacheConnectionException                    : CacheConnectionException,
    errorHandler                                : errorHandler,
    unknownRouteHandler                         : unknownRouteHandler,
    ImageNotUploadedException                   : ImageNotUploadedException
};
