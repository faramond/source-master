const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.fieldname === "businessPlan") {
      callback(null, "./projectDoc/businessPlan");
    } else if (file.fieldname === "presentation") {
      callback(null, "./projectDoc/presentation");
    } else if (file.fieldname === "chamberOfCommerceRegistration") {
      callback(null, "./projectDoc/chamberOfCommerceRegistration");
    }
  },

  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
let errorMsg = {
  message: "file type not supported",
};

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "application/pdf") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const projectDoc = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: fileFilter,
});

module.exports = projectDoc;
