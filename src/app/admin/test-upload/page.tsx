'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/admin/image-upload'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function TestUploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url)
    if (url) {
      setError(null)
    }
  }

  const testBucketCreation = async () => {
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // List all buckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()

      if (listError) {
        throw new Error(`Error listing buckets: ${listError.message}`)
      }

      // Check if images bucket exists
      const imagesBucketExists = buckets?.some(b => b.name === 'images')

      if (!imagesBucketExists) {
        // Try to create the bucket
        const { error: createError } = await supabase.storage.createBucket('images', {
          public: true
        })

        if (createError) {
          throw new Error(`Error creating bucket: ${createError.message}`)
        }

        setError('Created "images" bucket successfully!')
      } else {
        setError('The "images" bucket already exists.')
      }

      // Test API endpoint
      try {
        const testResponse = await fetch('/api/upload/test', {
          method: 'GET',
        })

        if (!testResponse.ok) {
          const errorData = await testResponse.json()
          throw new Error(`API test failed: ${errorData.error || testResponse.statusText}`)
        }

        const result = await testResponse.json()
        setError(prev => `${prev || ''}\n\nAPI test: ${result.message}`)
      } catch (apiError: unknown) {
        console.error('API test error:', apiError)
        setError(prev => `${prev || ''}\n\nAPI test error: ${(apiError as Error).message}`)
      }
    } catch (err: unknown) {
      console.error('Bucket test error:', err)
      setError(`Error: ${(err as Error).message}`)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Link
          href="/admin"
          className="text-primary hover:underline flex items-center gap-2 mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Link>
        <h1 className="text-3xl font-bold">Test Image Upload</h1>
      </div>

      {error && (
        <Alert className="mb-6" variant={error.includes('Error') ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Image Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              bucket="images"
              folder="public"
              onUploadComplete={handleUploadComplete}
            />

            {uploadedUrl && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Image URL:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={uploadedUrl}
                    readOnly
                    className="flex-1 p-2 text-sm bg-muted rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedUrl)
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Storage Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Test your Supabase storage configuration by checking if the required buckets exist.
            </p>

            <div className="flex flex-col gap-4">
              <Button onClick={testBucketCreation}>
                Test Bucket Configuration
              </Button>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Storage Policies</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you&apos;re having upload issues, you may need to configure storage policies.
                </p>
                <Button asChild variant="outline">
                  <Link href="/admin/storage/policies">
                    Manage Storage Policies
                  </Link>
                </Button>
              </div>
            </div>

            {uploadedUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="border rounded-md overflow-hidden relative h-[300px]">
                  <Image
                    src={uploadedUrl}
                    alt="Uploaded preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
