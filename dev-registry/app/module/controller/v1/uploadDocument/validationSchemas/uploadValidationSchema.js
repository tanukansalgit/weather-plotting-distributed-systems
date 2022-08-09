const joi = require('joi');
const underscore = require('underscore');
const constant = require(__basePath + 'app/config/constant');
const exception = require(constant.path.app + 'util/exception');
const { writeLogInfo } = require(constant.path.app + 'util/logger');
const validationHelper = require(constant.path.app + 'util/validation');

exports.uploadDocs =  (req, res, next) => {
  writeLogInfo([' [uploadDocs]','[validation] called for', [req.query] ]);
  const schema = joi.object().keys({
    'dbName': joi.string().required(),
    'collectionName': joi.string().required(),
    'appName': joi.string().required(),
    'filePath': joi.string().required(),
    'isEncrypted': joi.boolean().required()
  });

  let result = schema.validate(req.query, validationHelper.validationDefaultObject);
  underscore.extend(req, result.value);
  return result.error ? next(new exception.ValidationErrorException(validationHelper.parseError(result.error))) : next();
};

