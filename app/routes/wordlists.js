const express = require("express");
const router = express.Router();
const { upload, getAll } = require("../controllers/wordlists.controller");
const { multerUpload } = require("../middleware/fileUpload");

router.post("/upload/:name", multerUpload.single("file"), upload);
router.get("/", getAll);

module.exports = router;
