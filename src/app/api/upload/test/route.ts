import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
  try {
    // Create a Supabase client with server-side auth
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: (name, value, options) => {
            cookieStore.set({ name, value, ...options });
          },
          remove: (name, options) => {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json(
        { error: `Authentication error: ${authError.message}` },
        { status: 401 }
      );
    }
    
    // Test storage access
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        return NextResponse.json(
          { error: `Error listing buckets: ${listError.message}` },
          { status: 500 }
        );
      }
      
      // Check if images bucket exists
      const imagesBucketExists = buckets?.some(b => b.name === 'images');
      
      if (!imagesBucketExists) {
        // Try to create the bucket
        const { error: createError } = await supabase.storage.createBucket('images', {
          public: true
        });
        
        if (createError) {
          return NextResponse.json(
            { error: `Error creating bucket: ${createError.message}` },
            { status: 500 }
          );
        }
      }
      
      // Test RLS policies
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      
      // Try to upload a test file
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload('test/api-test.txt', testFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        return NextResponse.json(
          { 
            message: `API endpoint is working, but there are RLS policy issues: ${uploadError.message}. Using the server-side API route should bypass these restrictions.`,
            error: uploadError.message,
            status: 'partial'
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json({
        message: 'API endpoint is working correctly and storage access is confirmed.',
        status: 'success',
        user: user ? { id: user.id, email: user.email } : null,
        buckets: buckets?.map(b => b.name) || []
      });
    } catch (storageError) {
      return NextResponse.json(
        { error: `Storage access error: ${storageError instanceof Error ? storageError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
