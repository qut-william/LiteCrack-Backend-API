require("dotenv").config();
const { SQSClient, GetQueueUrlCommand, CreateQueueCommand } = require("@aws-sdk/client-sqs");
const { S3Client, CreateBucketCommand } = require("@aws-sdk/client-s3");
const yargs = require("yargs");
const { red, green, blue, yellow } = require("colorette");

const sqsClient = new SQSClient({});
const s3Client = new S3Client({});

const SQS_QUEUE_NAME = process.env.SQS_QUEUE_NAME;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const checkQueue = async (queueName = SQS_QUEUE_NAME) =>
  await sqsClient.send(new GetQueueUrlCommand({ QueueName: queueName }));

const createQueue = async (queueName = SQS_QUEUE_NAME) =>
  await sqsClient.send(
    new CreateQueueCommand({
      QueueName: queueName,
    })
  );

const createBucket = async (bucketName = S3_BUCKET_NAME) => {
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );
};

yargs
  .command(
    "s3",
    "Creates an S3 bucket based on the S3_BUCKET_NAME environment variable.",
    () => {},
    async (argv) => {
      if (process.env.S3_BUCKET_NAME == undefined) return console.log(red("S3_BUCKET_NAME is not defined."));
      console.log(yellow("Creating bucket..."));
      await createBucket()
        .then(() => console.log(green("Successfully created bucket.")))
        .catch((err) =>
          console.log(
            err.Code === "BucketAlreadyOwnedByYou" ? green("Bucket already exists") : red("Error creating the bucket.")
          )
        );
    }
  )
  .command(
    "sqs",
    "Creates an SQS queue based on the SQS_QUEUE_NAME environment variable",
    () => {},
    async (argv) => {
      if (process.env.SQS_QUEUE_NAME == undefined) return console.log(red("SQS_QUEUE_NAME is not defined."));
      console.log(yellow("Creating queue..."));

      try {
        const res = await checkQueue();
        console.log(
          green("Queue already exists at:\n") +
            blue("SQS_QUEUE_URL=" + res?.QueueUrl) +
            green("\nPut this in the .env file if you haven't already.")
        );
      } catch (error) {
        if (error.Error.Code == "AWS.SimpleQueueService.NonExistentQueue") {
          const res = await createQueue().catch(() => console.log(red("Failed to create the queue.")));
          console.log(
            green("Successfully created queue at:\n") +
              blue("SQS_QUEUE_URL=" + res.QueueUrl) +
              green("\nPut this in the .env file if you haven't already.")
          );
        } else {
          console.log(red("Failed to check the queue."));
        }
      }
    }
  )
  .demandCommand(1, "Please provide a command (s3 or sqs).").argv;
