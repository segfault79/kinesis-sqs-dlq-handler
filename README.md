# Kinesis SQS DLQ handler

## Description
Use this handler to recover and retry bad messages that do not make it through the AWS Kinesis stream

This simple implementation reads messages from the SQS DLQ, gets the actual Kinesis records and submits them to a custom handler for processing.

For details see:
- https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html#services-kinesis-errors
- https://docs.aws.amazon.com/lambda/latest/dg/with-kinesisReader.html#services-kinesisReader-errors

## Run locally
```bash
export AWS_SESSION_TOKEN=$(your_session_token)
export SQSURL=https://$(your_sqs_dlq_url)

npm run dlqmover
```
