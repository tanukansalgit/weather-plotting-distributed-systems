const path = require('path');
const mongo = require('mongodb');
const constants = require(__basePath + 'app/config/constant');
const { multer } = require(constants.path.app + 'util/multer');
const response = require(constants.path.app + 'util/response');
const { encrypt, decrypt } = require(constants.path.app + 'util/crypto');
const { checkBooleanValue } = require(constants.path.app + 'util/valueChecker');
const { getDbConnection, getCollection } = require(constants.path.app + 'util/mongo');
const { writeLogInfo, writeLogErrorTrace } = require(constants.path.app + 'util/logger');

/**
 * Upload Documents
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
exports.uploadDocs = async function(req, res) {
  try {
    writeLogInfo(['[uploadDocument uploadDocs]','[controller] called for ', req.query]);
    const { dbName, collectionName } = req.query;
    const db = await getDbConnection(dbName);
    const isCollection = await getCollection(db, collectionName);
    if(!isCollection) {
      throw new Error('ERROR_COLLECTION_NOT_EXISTS');
    }
    multer.single('document')(req, res, async function (err) {
      if (req.fileValidationError) {
        return res.status(400).json(response.build(`${req.fileValidationError}`, {}));
      }
      if(err) {
        return res.status(500).json(response.build('ERROR_SERVER_ERROR', { error: err }));
      }
      req.query.fileName = req.fileName;
      const data = prepareDocument(req.query);
      const { ops } = await db.collection(collectionName).insertOne(data);
      writeLogInfo(['[uploadDocument uploadDocs]','[controller] response ', ops]);
      return res.status(200).json(response.build('SUCCESS', { result: ops }));
    });
  } catch (error) {
    writeLogErrorTrace(['[uploadDocument uploadDocs]', '[controller] Error: ', error]);
    return res.status(500).json(response.build('ERROR_SERVER_ERROR', { error: error }));
  }
};

/**
 * Download Documents
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
exports.downloadDoc = async function(req, res) {
  try {
    writeLogInfo(['[downloadDocument downloadDoc]','[controller] called for ', req.query]);
    const { dbName, collectionName, id } = req.query;
    const db = await getDbConnection(dbName);
    const isCollection = await getCollection(db, collectionName);
    if(!isCollection) {
      throw new Error('ERROR_COLLECTION_NOT_EXISTS');
    }
    const fileData = await db.collection(collectionName).findOne({_id: new mongo.ObjectID(id)});
    if(!fileData) {
      throw new Error('ERROR_DATA_NOT_FOUND');
    }
    if(checkBooleanValue(fileData.isEncrypted)) {
      fileData.filePath = decrypt(fileData.filePath, constants.crypto.secretKey, constants.crypto.iv);
    }
    const filePath = path.join(fileData.filePath, fileData.fileName);
    writeLogInfo(['[downloadDocument downloadDoc]','[controller] response ', filePath]);
    return res.download(filePath);
  } catch (error) {
    writeLogErrorTrace(['[downloadDocument downloadDoc]', '[controller] Error: ', error]);
    return res.status(500).json(response.build('ERROR_SERVER_ERROR', { error: error }));
  }
};

/**
 * Prepare Data for collection
 * @param {Object} data
 * @returns {Object}
 */
function prepareDocument(data) {
  const doc = {
    dbName: data.dbName,
    createdAt: new Date(),
    updatedAt: new Date(),
    appName: data.appName,
    fileName: data.fileName,
    isEncrypted: data.isEncrypted,
    collectionName: data.collectionName,
    filePath: checkBooleanValue(data.isEncrypted) ? encrypt(data.filePath, constants.crypto.secretKey, constants.crypto.iv) : data.filePath
  };
  return doc;
}
