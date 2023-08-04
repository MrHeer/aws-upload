import { Bucket } from 'sst/node/bucket'
import { Api } from 'sst/node/api'

import UploadForm from '@/components/upload-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Upload</CardTitle>
          <CardDescription>Upload file to AWS</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm
            bucketName={Bucket.Uploads.bucketName}
            apiUrl={Api.Api.url}
          />
        </CardContent>
      </Card>
    </main>
  )
}
