# LiteCrack-Backend-API

## Installation

Please ensure you have downloaded the latest version of Node (v18.17) [here](https://nodejs.org/en/download)

To install the necessary dependencies, please run the following command:


## Available Scripts

In the project directory, you must first run:

`npm install`

Downloads the dependencies for the project

`npm run setup [s3 | sqs]`

Sets up the AWS resources for the project. You must have the AWS CLI installed and configured with your credentials as well as the `S3_BUCKET_NAME` and `SQS_QUEUE_NAME` set in your environment variables.

`npm start`

Runs the app in the production mode.
Open http://localhost:5000 to view it in your browser.

`npm run dev`

Runs the app in the development mode (but will update with saved changes)
The will reload the server when you save changes.
You may also see any lint errors in the console.


## Environment Variables

You will need to create a .env file in the root directory of the project. This file will contain the following variables:

```bash
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN=YOUR_AWS_SESSION_TOKEN
AMAZON_REGION=ap-southeast-2

S3_BUCKET_NAME=YOUR_BUCKET_NAME
SQS_QUEUE_NAME=YOUR_QUEUE_NAME
SQS_QUEUE_URL=YOUR_QUEUE_URL
```
