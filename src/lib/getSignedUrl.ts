'use server'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const getSignedUploadUrl = async ({
  fileName,
  bucketName,
}: {
  fileName: string
  bucketName: string
}) => {
  const command = new PutObjectCommand({
    ACL: 'public-read',
    Key: fileName,
    Bucket: bucketName,
  })
  const putUrl = await getSignedUrl(new S3Client({}), command)
  return putUrl
}
