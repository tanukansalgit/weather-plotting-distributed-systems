const underscore = require("underscore");
const user = require(".");
const constant = require(__basePath + 'app/config/constant');
const response = require(constant.path.app + 'util/response');
const { writeLogInfo, writeLogErrorTrace } = require(constant.path.app + 'util/logger');
const { hash, validateHash } = require(constant.path.app + 'util/password');
const jwt            = require(constant.path.app + 'core/jwt');
const { getUniqueCode } = require(constant.path.app + 'util/utility');
const UserModel = require(constant.path.app + 'models/users');


exports.signUp = async function( req, res, next ) {
    try {
        requestBody = req.body

        userObject = {}
        userObject['firstName'] = requestBody['firstName']
        userObject['lastName'] = requestBody['lastName']
        userObject['email'] = requestBody['email']

        writeLogInfo(['[signup]', '[controller] called for: ', userObject ]);

        req.body.password = hash(req.body.password);
        
        let ifAlreadyExists = await UserModel.findOne({ "email" : requestBody['email']})
        if ( ifAlreadyExists ) {
            return res.status(200).json(response.build("EMAIL_ALREADY_EXISTS", { result: null } ));
        }

        let userDoc = await UserModel.create( { ...userObject, "password" : req.body.password } );

        return res.status(200).json(response.build('SUCCESS', userDoc ));
    
    } catch (error) {
        writeLogErrorTrace(['[signup]', '[controller] Error: ', error]);
        return res.status(500).json(response.build('ERROR_SERVER_ERROR', {error: error}));
    }

}


exports.logIn = async( req, res, next ) => {
    try {
        requestBody  = req.body
        writeLogInfo(['[login]', '[controller] called : ' , requestBody['email']]);
        let userData = await UserModel.findOne({ "email" : requestBody['email']})
        
        if( !userData) {
            return res.status(500).json(response.build('ERROR_USER_NOT_EXISTS', {}))
        }    

        if(!validateHash( userData.password, requestBody.password)) {
            return res.status(500).json(response.build('ERROR_INVALID_PASSWORD', {}));
        }

        const data = underscore.pick(userData , '_id', 'firstName', 'lastName', 'email' );
        data['sessionToken'] = getUniqueCode()
        const token = await new jwt().sign(data, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        
        await UserModel.update( { "_id" : userData['_id']}, { "sessionToken" : data['sessionToken']})


        writeLogInfo(['[login]', '[controller] response body: ', data]);
        data.token = token;
        return res.status(200).json(response.build("SUCCESS", { result: data } ));

    }
    catch(error) {
        writeLogErrorTrace(['[login]', '[controller] Error: ', error]);
        return res.status(500).json(response.build('ERROR_SERVER_ERROR', {error: error}));
    }
}


exports.logOut = async( req, res, next ) => {
    try {

        requestBody  = req.body
        writeLogInfo(['[logout]', '[controller] called : ' , requestBody ]);

        let data = await UserModel.update( { "_id" : requestBody['userId']}, { "sessionToken" : "" } )

        writeLogInfo(['[logout]', '[controller] response body: ', data ]);

        return res.status(200).json(response.build("SUCCESS", { result: "Logged Out Successfully." } ));

    }
    catch(error) {
        writeLogErrorTrace(['[logout]', '[controller] Error: ', error]);
        return res.status(500).json(response.build('ERROR_SERVER_ERROR', {error: error}));
    }
}
