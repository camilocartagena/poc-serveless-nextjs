const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SERVICE_TABLE;
module.exports = {
	dynamodb, tableName
};