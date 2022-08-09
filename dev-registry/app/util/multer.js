const fs = require('fs');
const path = require('path');
const multer = require('multer');
const constant = require(__basePath + 'app/config/constant');

const storage = multer.diskStorage({
  
  destination: function(req, file, callback) {
    let filePath = path.normalize(req.query.filePath);
    if (!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
    callback(null, path.join(filePath));
  },
  filename: function(req, file, callback) {
    let fileName = `${Date.now()}_${file.originalname}`;
    req.fileName = fileName;
    callback(null, fileName);
  }
  
});

const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(constant.multerFileNameRegex)) {
      req.fileValidationError = 'INVALID_FILE_TYPE';
      return cb(new Error('INVALID_FILE_TYPE'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fieldSize: constant.maxFileSize }});
exports.multer = upload;
