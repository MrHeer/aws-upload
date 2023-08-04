export async function uploadFile({ url, file }: { url: string; file: File }) {
  const response = await fetch(url, {
    body: file,
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
  })
  return response
}
