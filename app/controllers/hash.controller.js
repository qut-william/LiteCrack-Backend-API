const asyncHandler = require("express-async-handler");
const { checkIfKeyExists, storeHash, getObject } = require("../services/s3.service");
const { sendMessage } = require("../services/sqs.service");

exports.crack = asyncHandler(async (req, res) => {
  const { hash, wordlist } = req.body;

  if (!hash) return res.status(400).json({ error: true, message: "No hash provided" });
  if (!wordlist) return res.status(400).json({ error: true, message: "No wordlist selected" });

  const wordlistKey = "wordlists/" + wordlist + ".txt";
  if (!(await checkIfKeyExists(wordlistKey)))
    return res.status(400).json({ error: true, message: "Wordlist does not exist" });

  const hashKey = "hashes/" + wordlist + hash + ".json";

  // Try see and get the object if it already exists (pending/successful)
  const hashObject = await getObject(hashKey);
  if (hashObject) {
    const resObject = JSON.parse(await hashObject.Body.transformToString());
    return res.status(resObject.status == "pending" ? 202 : 200).json(resObject);
  }

  const objectBody = JSON.stringify({ hash: hash, cracked: null, status: "pending", created: new Date().getTime() });

  // Try to send the message to the queue, and if successful, store the hash as pending
  await sendMessage(JSON.stringify({ hash: hash, wordlist: wordlist }));
  await storeHash(hashKey, objectBody);

  return res.status(200).json({ message: "Upload successful" });
});
