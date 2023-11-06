const express = require("express");
const router = express.Router();
const { upload, getAll } = require("../controllers/wordlist.controller");
const { multerUpload } = require("../middleware/fileUpload");

router.post("/upload/:wordlist", multerUpload.single("file"), upload);
router.get("/", getAll);

module.exports = router;
