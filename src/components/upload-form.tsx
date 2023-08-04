'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'

import * as z from 'zod'
import FileInput from './file-input'
import { getSignedUploadUrl } from '@/lib/getSignedUrl'
import { uploadFile } from '@/lib/uploadFile'

const formSchema = z.object({
  text: z.string().min(1, { message: 'Please input some text.' }),
  file: z
    .any()
    .refine((file) => file instanceof File, 'Please upload a plain text file.'),
})

export default function UploadForm({
  bucketName,
  apiUrl,
}: {
  bucketName: string
  apiUrl: string
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      file: '',
    },
  })
  const { isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { text, file } = values
    const uploadUrl = await getSignedUploadUrl({
      fileName: file.name,
      bucketName,
    })
    await uploadFile({ url: uploadUrl, file })

    const data = {
      input_text: text,
      input_file_path: `${bucketName}/${file.name}`,
    }

    await fetch(`${apiUrl}/files`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileInput accept="text/plain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  )
}
