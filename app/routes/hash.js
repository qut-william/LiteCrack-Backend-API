const express = require("express");
const router = express.Router();
const { crack }= require("../controllers/hash.controller.js");

router.post("/upload", crack);

module.exports = router;
