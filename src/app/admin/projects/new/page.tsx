'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/admin/image-upload'

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    tags: '',
    image: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Process tags into an array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Insert the new project
      const { error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            full_description: formData.full_description,
            image: formData.image,
            tags: tagsArray
          }
        ])
        .select()

      if (error) throw error

      // Redirect to the projects page
      router.push('/admin/projects')
      router.refresh()
    } catch (err: unknown) {
      console.error('Error creating project:', err)
      setError((err as Error).message || 'An error occurred while creating the project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link
          href="/admin/projects"
          className="text-primary hover:underline flex items-center gap-2 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold">Add New Project</h1>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea
                id="full_description"
                name="full_description"
                value={formData.full_description}
                onChange={handleChange}
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, typescript, web development"
              />
            </div>

            <div className="space-y-2">
              <Label>Project Image</Label>
              <ImageUpload
                bucket="images"
                folder="public"
                onUploadComplete={handleImageUpload}
              />

              {imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="relative w-full max-w-md h-48 rounded-md border overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Project preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/projects">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
