const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

const lambdaDest = {}

lambdaDest.handle = async (events) => {
    console.log("Handling events", events);

    // implement your code here
    // lambda.invoke(...)
}

module.exports = lambdaDest;
