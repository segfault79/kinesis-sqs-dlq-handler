const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const sqsWriter = {}

sqsWriter.removeFromDlq = async (message) => {
    const deleteParams = {
        QueueUrl: sqsParams().QueueUrl,
        ReceiptHandle: message.ReceiptHandle
    };

    sqs.deleteMessage(deleteParams, function (err, data) {
        if (err) {
            console.log(`Failed to delete message ${message.MessageId} from DLQ, reason: ${err}`);
        } else {
            console.log(`Message ${message.MessageId} deleted from DLQ.`);
        }
    });
}

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

module.exports = sqsWriter;
