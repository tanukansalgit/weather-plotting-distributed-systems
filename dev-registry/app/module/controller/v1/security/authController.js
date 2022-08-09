const constant              = require(__basePath + '/app/config/constant');
const exception             = require(constant.path.app + 'core/exception');
const jwt                   = require(constant.path.app + 'core/jwt');
const { writeLogInfo, writeLogErrorTrace } = require(constant.path.app + 'util/logger');
const UserModel = require(constant.path.app + 'models/users');
const response = require(constant.path.app + 'util/response');


/**
 * controller for Verifying Access Token
 */
exports.verifyAccessToken = async function (req, res, next) {
	writeLogInfo(['[verifyAccessToken]', '[controller] called : ', [req.headers]]);
	try {

		if (!req.headers['codist-access-token']) {
			return next(new exception.HeaderNotFoundException());
		}
		const accessToken = req.headers['codist-access-token'];
		const decryptedToken = await new jwt().verify(accessToken, process.env.JWT_SECRET);

        let ifValidUser = await UserModel.findOne({ "email" : decryptedToken.email, "sessionToken" : decryptedToken.sessionToken })

        if( !ifValidUser ) {
            return res.status(500).json(response.build('UNAUTHORIZED_USER', { "authorized" : false , "userId" : decryptedToken['_id']}))
        }
		
		writeLogInfo(['[verifyAccessToken]', '[controller] response : ', decryptedToken]);

        return res.status(200).json(response.build("SUCCESS", { result: { "authorized" : true, "userId" : decryptedToken['_id'] } } ));

	} catch (error) {
			writeLogErrorTrace(['[verifyAccessToken]', '[controller] Error: ', error]);
			return res.status(500).json(response.build('ERROR_SERVER_ERROR', {error: error}));
	}
};

exports.verifyAccessTokenMiddleware = async function (req, res, next) {
	writeLogInfo(['[verifyAccessTokenMiddleware]', '[controller] called : ', [req.headers]]);
	try {

		if (!req.headers['codist-access-token']) {
			return next(new exception.HeaderNotFoundException());
		}
		const accessToken = req.headers['codist-access-token'];
		const decryptedToken = await new jwt().verify(accessToken, process.env.JWT_SECRET);

        let ifValidUser = await UserModel.findOne({ "email" : decryptedToken.email, "sessionToken" : decryptedToken.sessionToken })

        if( !ifValidUser ) {
            return res.status(500).json(response.build('UNAUTHORIZED_USER', { "authorized" : false , "userId" : decryptedToken['_id']}))
        }
		
		writeLogInfo(['[verifyAccessTokenMiddleware]', '[controller] response : ', decryptedToken]);
		req.body.userId = decryptedToken['_id']
       next( )

	} catch (error) {
			writeLogErrorTrace(['[verifyAccessTokenMiddleware]', '[controller] Error: ', error]);
			return res.status(500).json(response.build('ERROR_SERVER_ERROR', {error: error}));
	}
};