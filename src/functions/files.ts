import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";
import { Table } from "sst/node/table";
import { ApiHandler } from "sst/node/api";
import HttpStatus from 'http-status';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const createFile = ApiHandler(async (event) => {
  if (event.body === undefined) return { statusCode: HttpStatus['BAD_REQUEST'] }

  const data = JSON.parse(event.body);
  const item = {
    id: nanoid(), // A unique uuid
    ...data,
  }
  const create = new PutCommand({
    // Get the table name from the environment variable
    TableName: Table.Files.tableName,
    Item: item
  })

  await db.send(create);

  return {
    statusCode: HttpStatus['OK'],
    body: JSON.stringify(item),
  };
});

export const updateFile = ApiHandler(async (event) => {
  const id = event.pathParameters?.id
  if (event.body === undefined || id === undefined) return { statusCode: HttpStatus['BAD_REQUEST'] }

  const data = JSON.parse(event.body);
  const item = data;
  const update = new UpdateCommand({
    TableName: Table.Files.tableName,
    Key: { id },
    UpdateExpression: "SET input_text = :input_text, input_file_path = :input_file_path, output_file_path = :output_file_path",
    ExpressionAttributeValues: {
      ":input_text": item['input_text'],
      ":input_file_path": item['input_file_path'],
      ":output_file_path": item['output_file_path']
    }
  })

  await db.send(update);

  return {
    statusCode: HttpStatus['OK'],
    body: JSON.stringify(item),
  };
});
