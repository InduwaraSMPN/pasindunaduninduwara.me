import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function StoragePage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get all files from the images bucket
  const { data: files, error } = await supabase
    .storage
    .from('images')
    .list('public', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Storage</h1>
        <Button asChild>
          <Link href="/admin/storage/upload">Upload New Image</Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          Error loading files: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files && files.length > 0 ? (
          files.map((file) => {
            // Skip folders and non-image files
            if (file.id === null) return null

            const { data: { publicUrl } } = supabase
              .storage
              .from('images')
              .getPublicUrl(`public/${file.name}`)

            return (
              <Card key={file.id} className="overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={publicUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {Math.round(file.metadata.size / 1024)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(publicUrl)
                      }}
                    >
                      Copy URL
                    </Button>
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
