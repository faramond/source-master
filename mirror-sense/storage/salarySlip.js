const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './salary/')
    },

    filename: function (req, file, callback) {
        callback(null, new Date().toISOString()+file.originalname);

    },
});
let errorMsg = {
    message: 'file type not supported'
};

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'application/msexcel' || file.mimetype === 'application/xslx') {
        callback(null, true);
    }
  else {
        callback(null, false)
    }
}
const salaryS = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    fileFilter:fileFilter
});


module.exports = salaryS;