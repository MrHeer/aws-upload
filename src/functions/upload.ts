import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import { Table } from "sst/node/table";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    // Get the table name from the environment variable
    TableName: Table.Files.tableName,
    Item: {
      noteId: nanoid(), // A unique uuid
      content: data.content, // Parsed from request body
      createdAt: Date.now(),
    },
  };
  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
