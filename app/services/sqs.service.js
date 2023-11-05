require("dotenv").config();
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const client = new SQSClient({ region: process.env.AMAZON_REGION });
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.sendMessage = async (body) => {
  await client.send(
    new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: body,
    })
  );
};
