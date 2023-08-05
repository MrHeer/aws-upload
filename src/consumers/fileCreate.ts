import { DynamoDBStreamEvent } from 'aws-lambda'
import { Job } from 'sst/node/job'

export async function main(event: DynamoDBStreamEvent) {
  event.Records.forEach(async (record) => {
    const id = record.dynamodb?.Keys?.['id']?.['S']
    if (id === undefined) throw 'id is undefined.'
    await Job.FileAppendJob.run({
      payload: {
        id,
      },
    })
  })
}
