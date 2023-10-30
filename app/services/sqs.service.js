require("dotenv").config();
const { SQSClient, ReceiveMessageCommand, SendMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");

const client = new SQSClient({});
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

const receiveMessage = async () =>
  await client.send(
    new ReceiveMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ["All"],
      WaitTimeSeconds: 1,
      VisibilityTimeout: 10,
    })
  );

exports.sendMessage = async (body) => {
  await client.send(
    new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: body,
    })
  );
};

exports.main = async () => {
  const { Messages } = await receiveMessage();

  console.log(Messages);
};

this.main();
