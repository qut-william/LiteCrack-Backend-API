const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const bodyParser = require("body-parser");

require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

const wordlist = require("./app/routes/wordlists.js");
const hash = require("./app/routes/hash.js");
const errorHandler = require("./app/middleware/errorHandler.js");

app.use("/wordlist", wordlist);
app.use("/hash", hash);

app.use(async function (req, res) {
  return res.status(404).json({
    status: "error",
    message: "Page not found!",
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
