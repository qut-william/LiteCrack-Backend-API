const multer = require("multer");

const storage = multer.memoryStorage();

exports.multerUpload = multer({
  storage: storage,
  limits: { fileSize: 100000 }, 
});
