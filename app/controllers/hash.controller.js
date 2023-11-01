const asyncHandler = require("express-async-handler");
const { checkIfKeyExists, storeHash, getObject } = require("../services/s3.service");
const { sendMessage } = require("../services/sqs.service");

exports.crack = asyncHandler(async (req, res) => {
  const { hash, wordlist } = req.body;

  if (!hash) return res.status(400).json({ error: true, message: "No hash provided" });
  if (!wordlist) return res.status(400).json({ error: true, message: "No wordlist selected" });

  // Check if wordlist exist
  const wordlistKey = "wordlists/" + wordlist + ".txt";
  if (!(await checkIfKeyExists(wordlistKey)))
    return res.status(400).json({ error: true, message: "Wordlist does not exist" });

  // Check if hash is already cracked
  const crackedHashKey = "cracked/" + hash + ".json";
  if (await checkIfKeyExists(crackedHashKey)) {
    const crackedHashObject = await getObject(crackedHashKey);
    const resObject = JSON.parse(await crackedHashObject.Body.transformToString());
    return res.status(200).json(resObject);
  }

  // Check if hash is pending
  const hashKey = "hashes/" + wordlist + hash + ".json";
  if (await checkIfKeyExists(hashKey)) {
    const hashObject = await getObject(hashKey);
    const resObject = JSON.parse(await hashObject.Body.transformToString());
    if (resObject.status === "PENDING") return res.status(202).json(resObject);
    else return res.status(200).json(resObject);
  }

  // Start a job to crack the hash
  const objectBody = JSON.stringify({ hash: hash, status: "PENDING", created: new Date().getTime() });
  await sendMessage(JSON.stringify({ hash: hash, wordlist: wordlist }));
  await storeHash(hashKey, objectBody);
  return res.status(200).json({ message: "Upload successful" });
});
