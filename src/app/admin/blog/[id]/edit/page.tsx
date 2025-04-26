'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import ImageUpload from '@/components/admin/image-upload'
import { Loader2 } from 'lucide-react'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categories: '',
    thumbnail: '',
    published: false
  })

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data: post, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error

        if (post) {
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            categories: post.categories ? post.categories.join(', ') : '',
            thumbnail: post.thumbnail || '',
            published: post.published || false
          })
          setImageUrl(post.thumbnail || '')
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err)
        setError(err.message || 'An error occurred while fetching the blog post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, published: checked }))
  }

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    setFormData(prev => ({ ...prev, thumbnail: url }))
  }

  const generateSlug = () => {
    if (!formData.title) return
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    setFormData(prev => ({ ...prev, slug }))
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

      // Process categories into an array
      const categoriesArray = formData.categories
        .split(',')
        .map(category => category.trim())
        .filter(category => category.length > 0)

      // Prepare the post data
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        categories: categoriesArray,
        thumbnail: formData.thumbnail,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null
      }

      // Update the blog post
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', params.id)

      if (error) throw error

      // Redirect to the blog posts page
      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      console.error('Error updating blog post:', err)
      setError(err.message || 'An error occurred while updating the blog post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link 
          href="/admin/blog" 
          className="text-primary hover:underline flex items-center gap-2 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="slug">Slug</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={generateSlug}
                  className="text-xs"
                >
                  Generate from title
                </Button>
              </div>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="my-blog-post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="A brief summary of your post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma separated)</Label>
              <Input
                id="categories"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder="web development, design, technology"
              />
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload 
                bucket="images" 
                folder="public" 
                onUploadComplete={handleImageUpload}
                defaultImageUrl={imageUrl}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/blog">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
