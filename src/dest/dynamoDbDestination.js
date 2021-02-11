const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const dynamoDbDest = {}

dynamoDbDest.handle = async (events) => {
    console.log("Handling events", events);

    // implement your code here
    // dynamoDb.putItem(...)
}

module.exports = dynamoDbDest;
