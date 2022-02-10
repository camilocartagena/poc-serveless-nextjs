'use strict';
const db = require('./config/db_config.js');
const util = require('./utils/headers.js');
const moment = require('moment');
const uuid = require('uuid').v4;
module.exports.getServices = async event => {
  try {
    let user_id = util.getUserId(event.headers);
    let params = {
      TableName: db.tableName,
      KeyConditionExpression: "user_id = :uid",
      ExpressionAttributeValues: {
        ":uid": user_id
      },
      ScanIndexForward: false
    }
    let data = await db.dynamodb.query(params).promise();
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown Error"
      })
    };
  }
};
module.exports.getService = async event => {
  try {
  
    let service_id = event.pathParameters.service_id;
    let params = {
      TableName: db.tableName,
      Key: {
        user_id: util.getUserId(event.headers),
        service_id: service_id
      }
    }
    let data = await db.dynamodb.get(params).promise();
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown Error"
      })
    };
  }
};
module.exports.addService = async event => {
  try {
    let item = JSON.parse(event.body).Item;
    item.user_id = util.getUserId(event.headers);    
    item.user_name = util.getUserName(event.headers);    
    item.service_id = item.user_id + ':' + uuid()
    item.timestamp = moment().unix()
    let data = await db.dynamodb.put({
      TableName: db.tableName,
      Item: item
    }).promise();
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
    }
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown Error"
      })
    };
  }
};
module.exports.updateService = async event => {
  try {
    let item = JSON.parse(event.body).Item;
    item.user_id = util.getUserId(event.headers);    
    item.user_name = util.getUserName(event.headers);    
    let data = await db.dynamodb.put({
      TableName: db.tableName,
      Item: item,
      ConditionExpression: '#t = :t',
      ExpressionAttributeNames: {
        '#t': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':t': item.timestamp
      }
    }).promise();
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
    }
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown Error"
      })
    };
  }
};
module.exports.deleteService = async event => {
  try {
    let service_id = event.pathParameters.service_id;
    let params = {
      TableName: db.tableName,
      Key: {
        user_id: util.getUserId(event.headers),
        service_id: service_id
      }
    }
    let data = await db.dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown Error"
      })
    };
  }
};
