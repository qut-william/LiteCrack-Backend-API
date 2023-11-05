const asyncHandler = require("express-async-handler");
const { createWordlist, checkIfKeyExists, getAllWordLists } = require("../services/s3.service");

exports.upload = asyncHandler(async (req, res) => {
  const { wordlist } = req.params;

  // Remove any /s from the wordlist (because they're used in S3 keys).
  const cleanWordList = wordlist.replace(/\//g, "\\");

  if (!req.file) return res.status(400).json({ error: true, message: "No file uploaded" });
  if (!cleanWordList) return res.status(400).json({ error: true, message: "No name provided" });

  const objectKey = "wordlists/" + cleanWordList + ".txt";
  if (await checkIfKeyExists(objectKey)) return res.status(400).json({ error: true, message: "Name already taken" });

  const fileData = req.file.buffer;
  await createWordlist(objectKey, fileData);

  return res.status(200).json({ message: "Upload successful" });
});

exports.getAll = asyncHandler(async (req, res) => {
  const wordlists = await getAllWordLists();
  return res.status(200).json(wordlists);
});
