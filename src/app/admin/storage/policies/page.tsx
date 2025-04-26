'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPolicyTemplatesForBucket } from '@/lib/supabase-policies'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function StoragePoliciesPage() {
  const [bucketName, setBucketName] = useState('images')
  const [policyTemplates, setPolicyTemplates] = useState<Record<string, string>>({})
  const [buckets, setBuckets] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('publicRead')
  
  useEffect(() => {
    // Get policy templates
    const templates = getPolicyTemplatesForBucket(bucketName)
    setPolicyTemplates(templates)
    
    // Get buckets
    const fetchBuckets = async () => {
      setLoading(true)
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase.storage.listBuckets()
        
        if (error) {
          throw error
        }
        
        if (data) {
          setBuckets(data.map(bucket => bucket.name))
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch buckets')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBuckets()
  }, [bucketName])
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('SQL copied to clipboard!')
    setTimeout(() => setSuccess(null), 3000)
  }
  
  const openSupabaseDashboard = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      window.open(`${supabaseUrl}/project/default/storage/buckets/${bucketName}/policies`, '_blank')
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Link 
          href="/admin/storage" 
          className="text-primary hover:underline flex items-center gap-2 mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Storage
        </Link>
        <h1 className="text-3xl font-bold">Storage Policies</h1>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Storage Bucket Policies</CardTitle>
            <CardDescription>
              Configure Row-Level Security (RLS) policies for your storage buckets.
              These policies control who can read, create, update, and delete files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Available Buckets</h3>
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  <p>Loading buckets...</p>
                ) : buckets.length > 0 ? (
                  buckets.map(bucket => (
                    <Button 
                      key={bucket} 
                      variant={bucket === bucketName ? "default" : "outline"}
                      onClick={() => setBucketName(bucket)}
                    >
                      {bucket}
                    </Button>
                  ))
                ) : (
                  <p>No buckets found</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Policy Templates for "{bucketName}"</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select a policy template and copy the SQL to run in the Supabase dashboard SQL editor.
                You need to run these SQL commands in the Supabase dashboard to apply the policies.
              </p>
              
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={openSupabaseDashboard}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase Dashboard
              </Button>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                  <TabsTrigger value="publicRead">Public Read</TabsTrigger>
                  <TabsTrigger value="authenticatedInsert">Auth Insert</TabsTrigger>
                  <TabsTrigger value="publicFilesInPublicFolder">Public Folder</TabsTrigger>
                  <TabsTrigger value="publicJpgInPublicFolder">JPG in Public</TabsTrigger>
                </TabsList>
                
                {Object.entries(policyTemplates).map(([key, sql]) => (
                  <TabsContent key={key} value={key} className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {key === 'publicRead' && 'Allow anyone to read files'}
                          {key === 'authenticatedInsert' && 'Allow authenticated users to upload files'}
                          {key === 'authenticatedUpdate' && 'Allow authenticated users to update files'}
                          {key === 'authenticatedDelete' && 'Allow authenticated users to delete files'}
                          {key === 'publicJpgInPublicFolder' && 'Allow access to JPG images in public folder'}
                          {key === 'publicFilesInPublicFolder' && 'Allow access to all files in public folder'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                            <code>{sql}</code>
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(sql)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  To apply these policies, you need to:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Copy the SQL for the policy you want to apply</li>
                  <li>Go to the Supabase dashboard</li>
                  <li>Navigate to the SQL editor</li>
                  <li>Paste and run the SQL</li>
                </ol>
                <p className="mt-2">
                  You can also configure policies through the Storage UI in the Supabase dashboard.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
