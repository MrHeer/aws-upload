import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";

import UploadForm from "@/components/upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: Bucket.Uploads.bucketName,
  });
  const putUrl = await getSignedUrl(new S3Client({}), command);

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Upload</CardTitle>
          <CardDescription>Upload file to AWS</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm putUrl={putUrl} />
        </CardContent>
      </Card>
    </main>
  )
}
