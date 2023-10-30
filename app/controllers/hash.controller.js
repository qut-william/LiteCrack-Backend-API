const asyncHandler = require("express-async-handler");
const { checkIfKeyExists, storeHash } = require("../services/s3.service");
const { sendMessage } = require("../services/sqs.service");

exports.crack = asyncHandler(async (req, res) => {
  const { hash, key: name } = req.body;

  console.log(req.body);
  if (!hash) return res.status(400).json({ error: true, message: "No hash provided" });
  if (!name) return res.status(400).json({ error: true, message: "No key provided" });

  if (!checkIfKeyExists(name)) return res.status(400).json({ error: true, message: "Key does not exist" });

  const objectKey = "hashes/" + name + hash + ".json";
  const objectBody = JSON.stringify({ hash: hash, cracked: null, status: "pending", created: new Date().getTime() });
  await storeHash(objectKey, objectBody);
  await sendMessage(JSON.stringify({ hash: hash, objectKey: objectKey }));

  return res.status(200).json({ message: "Upload successful" });
});
