'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, X, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

interface ImageUploadProps {
  bucket: string
  folder?: string
  onUploadComplete: (url: string) => void
  defaultImageUrl?: string
}

export default function ImageUpload({
  bucket,
  folder = '',
  onUploadComplete,
  defaultImageUrl,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(defaultImageUrl || null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create a preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Use the server-side API route to handle the upload
      // This bypasses client-side RLS policies
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      if (folder) {
        formData.append('folder', folder)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error uploading file')
      }

      if (!result.publicUrl) {
        throw new Error('No public URL returned from upload')
      }

      onUploadComplete(result.publicUrl)
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Error uploading file')
      setPreview(defaultImageUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    await processFile(files[0])
  }

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const clearImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onUploadComplete('')
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
          }`}
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop an image, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPEG, PNG, GIF, WebP
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="image">
          {preview ? 'Change Image' : 'Upload Image'}
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
          className="cursor-pointer"
        />
      </div>

      {uploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  )
}
