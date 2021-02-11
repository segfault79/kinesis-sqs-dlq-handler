const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const kinesisReader = require("./source/kinesisReader");
const dynamoDbDest = require("./dest/dynamoDbDestination");
const lambdaDest = require("./dest/lambdaDestination");
const sqsWriter = require("./dest/sqsWriter");

console.log(`Starting...`);

sqs.receiveMessage(sqsParams(), async function (err, data) {
    if (err) {
        console.error(`Failed to receive messages from SQS, reason: ${err}`);
        return;
    }

    console.log(`Found ${data.Messages.length} messages in DLQ to process.`);
    data.Messages.forEach(message => {
        kinesisReader.readRecordsFromKinesis(message)
            .then(jsonEvents => {
                // add your custom handler here
                dynamoDbDest.handle(jsonEvents);
                lambdaDest.handle(jsonEvents);
            })
            .then(() => {
                sqsWriter.removeFromDlq(message)
            })
            .catch(err => {
                console.log(`Failed to process message ${message.MessageId}, reason: ${err}`);
            });
    });
});

function sqsParams() {
    const queueURL = process.env.SQSURL;

    return {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0
    };
}
