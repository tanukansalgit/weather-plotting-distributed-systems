const mongoose = require("mongoose")
const constant        = require(__basePath + 'app/config/constant');
const { writeLogInfo, writeLogErrorTrace } = require(constant.path.app + 'util/logger');


/**
 * create db connection
 * @method
 * @param {String} dbName
 * @returns {Object} db instance 
 */
exports.getDbConnection = async function() {
    mongoUrl = process.env.MONGO_URL
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        const conn = await mongoose.connect(mongoUrl, options );
        writeLogInfo(['[ Database Connected ] ']);
        return conn;
    } catch (error) {
        writeLogErrorTrace(['[Database Connection]', ' Error: ', error ]);
        return Promise.reject(error);
    }
}

/**
 * Convert string to ObjectId
 * @param {[string]} ids 
 */
exports.convertStringIdsToObjectIds = async function(ids) {
    return _.map(ids, function (id) {
        return new mongoose.Types.ObjectId(id);
    });
}


/**
 * Convert string to ObjectId
 * @param {string} id 
 */
exports.convertToObjectId = async function(id) {
    return new mongoose.Types.ObjectId(id);
}


/**
 * get collection meta data if collection exists
 * @method
 * @param {String} collectionName
 * @param {Object} db db instance
 * @returns {Object}
 */
exports.getCollection = async function(db, collectionName) {
    return await db.listCollections({name: collectionName}).next();
}