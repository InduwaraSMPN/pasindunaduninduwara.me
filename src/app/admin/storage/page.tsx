import { createServerClient, BUCKET_ID, getFileUrl } from '@/lib/appwrite'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CopyUrlButton from '@/components/admin/copy-url-button'

export default async function StoragePage() {
  const { storage } = createServerClient()

  const files = await storage.listFiles(BUCKET_ID)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Storage</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/storage/upload">Upload New Image</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.files && files.files.length > 0 ? (
          files.files.map((file) => {
            const publicUrl = getFileUrl(file.$id)
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)

            return (
              <Card key={file.$id} className="overflow-hidden">
                <div className="relative h-40">
                  {isImage ? (
                    <Image
                      src={publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <span className="text-sm text-muted-foreground uppercase">
                        {file.name.split('.').pop()}
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="text-sm truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {file.sizeOriginal < 1024
                        ? `${file.sizeOriginal} B`
                        : `${Math.round(file.sizeOriginal / 1024)} KB`}
                    </span>
                    <CopyUrlButton url={publicUrl} />
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No images found. Upload some images to get started.
          </div>
        )}
      </div>
    </div>
  )
}
