const constant = require(__basePath + '/app/config/constant');
const { upload } = require(constant.path.app + 'util/multer');
const router = require('express').Router({ caseSensitive: true, strict: true});
const { uploadValidationSchema } = require(constant.path.moduleV1 + 'uploadDocument/validationSchemas');
const { uploadController } = require(constant.path.moduleV1 + '/uploadDocument/controllers');

// upload single document
router.post('/',
    uploadValidationSchema.uploadDocs,
    uploadController.uploadDocs
);

// download document
router.get('/download',
    // uploadValidationSchema.downloadDoc,
    uploadController.downloadDoc
);

exports.router = router;