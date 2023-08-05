import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { Bucket } from 'sst/node/bucket'
import { JobHandler } from 'sst/node/job'
import { Table } from 'sst/node/table'

declare module 'sst/node/job' {
  export interface JobTypes {
    FileAppendJob: {
      id: string
    }
  }
}

type FileRecord = {
  id: string
  inputText: string
  inputFilePath: string
}

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3 = new S3Client({})

export const main = JobHandler('FileAppendJob', async ({ id }) => {
  const record = await getRecordFromTable(id)
  const filename = extractFilename(record.inputFilePath)
  const file = await getFileFromS3(filename)
  const fileContent = await file.Body?.transformToString()
  if (fileContent === undefined) throw 'No content in input file.'
  const outputFilename = 'output' + '-' + filename
  const outputFilePath = Bucket.Uploads.bucketName + '/' + outputFilename
  const outputContent = createOutputContent({
    inputText: record.inputText,
    fileContent,
  })
  await putFileContentToS3(outputFilename, outputContent)
  await updateRecordToDB({ id, outputFilePath })
})

function extractFilename(filePath: string) {
  return filePath.split('/')[1]
}

function createOutputContent({
  inputText,
  fileContent,
}: {
  inputText: string
  fileContent: string
}) {
  return fileContent + ':' + inputText
}

async function getRecordFromTable(id: string) {
  const get = new GetCommand({
    TableName: Table.Files.tableName,
    Key: { id },
  })
  const response = await db.send(get)
  const record = response.Item
  const inputText = record?.['input_text']
  const inputFilePath = record?.['input_file_path']
  if (inputText === undefined || inputFilePath === undefined)
    throw 'Some fields are undefined'
  return {
    id,
    inputText,
    inputFilePath,
  } as FileRecord
}

async function updateRecordToDB({
  id,
  outputFilePath,
}: {
  id: string
  outputFilePath: string
}) {
  const update = new UpdateCommand({
    TableName: Table.Files.tableName,
    Key: { id },
    UpdateExpression: 'SET output_file_path = :output_file_path',
    ExpressionAttributeValues: {
      ':output_file_path': outputFilePath,
    },
  })
  await db.send(update)
}

async function getFileFromS3(key: string) {
  const command = new GetObjectCommand({
    Key: key,
    Bucket: Bucket.Uploads.bucketName,
  })
  const file = await s3.send(command)
  return file
}

async function putFileContentToS3(key: string, file: string) {
  const command = new PutObjectCommand({
    Key: key,
    Bucket: Bucket.Uploads.bucketName,
    Body: file,
  })
  await s3.send(command)
}
