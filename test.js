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

const sendMessage = async (messageBody) =>
  await client.send(
    new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: messageBody,
    })
  );

const deleteMessage = (receiptHandle) =>
  client.send(
    new DeleteMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
  );

exports.main = async () => {
  const { Messages } = await receiveMessage();

  console.log(Messages);
};

this.main();
