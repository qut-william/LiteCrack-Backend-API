require("dotenv").config();
const { S3Client, HeadObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3Client = new S3Client({});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

exports.checkIfKeyExists = async (key) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new HeadObjectCommand(params));
    return true;
  } catch (error) {
    return false;
  }
};

exports.createWordlist = async (key, body) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: body,
    },
  });

  await upload.done();
};

exports.getAllWordLists = async () => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Prefix: "wordlists/",
  };

  const data = await s3Client.send(new ListObjectsCommand(params));
  const newData = data.Contents.filter((item) => item.Key.endsWith(".txt")).map((item) => ({
    key: item.Key.replace("wordlists/", "").replace(".txt", ""),
    size: item.Size,
  }));

  console.log(newData);
  return newData;
};

exports.storeHash = async (key, body) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: body,
    },
  });

  await upload.done();
};
