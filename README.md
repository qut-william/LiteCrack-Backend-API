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



