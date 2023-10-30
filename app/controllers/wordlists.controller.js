const asyncHandler = require("express-async-handler");
const { createWordlist, checkIfKeyExists, getAllWordLists } = require("../services/s3.service");

exports.upload = asyncHandler(async (req, res) => {
  const { name } = req.params;
  if (!req.file) return res.status(400).json({ error: true, message: "No file uploaded" });
  if (!name) return res.status(400).json({ error: true, message: "No name provided" });

  const objectKey = "wordlists/" + name + ".txt";
  if (await checkIfKeyExists(objectKey)) return res.status(400).json({ error: true, message: "Name already taken" });

  const fileData = req.file.buffer;
  await createWordlist(objectKey, fileData);

  return res.status(200).json({ message: "Upload successful" });
});

exports.getAll = asyncHandler(async (req, res) => {
  const wordlists = await getAllWordLists();
  return res.status(200).json(wordlists);
});
