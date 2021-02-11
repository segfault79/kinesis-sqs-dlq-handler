const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();

const kinesisReader = {}

kinesisReader.readRecordsFromKinesis = async (message) => {
    const messageBody = JSON.parse(message.Body);
    console.log(`Handling DLQ message ${message.MessageId} because of ${messageBody.requestContext.condition}`);

    return getKinesisShardIterator(messageBody)
        .then(res => {
            return getKinesisRecords(res.ShardIterator, messageBody.KinesisBatchInfo.batchSize);
        })
        .then(records => {
            return extractRecordDataAsJson(records);
        });
}

function getKinesisShardIterator(body) {
    const StreamName = parseKinesisStreamName(body);
    const ShardId = body.KinesisBatchInfo.shardId;
    const ShardIteratorType = 'AT_SEQUENCE_NUMBER';
    const StartingSequenceNumber = body.KinesisBatchInfo.startSequenceNumber;

    return kinesis.getShardIterator({
        ShardId,
        ShardIteratorType,
        StreamName,
        StartingSequenceNumber,
    }).promise();
}

async function getKinesisRecords(shardIterator, batchSize) {
    return await kinesis.getRecords({
        ShardIterator: shardIterator,
        Limit: batchSize,
    }).promise();
}

async function extractRecordDataAsJson(records) {
    return records.Records.map(record => {
        console.log(`Handling Kinesis record ${record.SequenceNumber} of ${record.ApproximateArrivalTimestamp}`);
        const payload = Buffer.from(record.Data, "base64").toString("utf-8");
        return JSON.parse(payload);
    });
}

function parseKinesisStreamName(body) {
    return body.KinesisBatchInfo.streamArn.split('/')[1];
}

module.exports = kinesisReader;
