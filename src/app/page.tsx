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
    <main className="flex min-h-screen items-center justify-center p-2 sm:p-24">
      <Card className="w-[350px] border-none shadow-none sm:border sm:shadow-lg">
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
