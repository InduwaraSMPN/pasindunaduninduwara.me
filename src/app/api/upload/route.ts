import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const folder = formData.get('folder') as string;
    
    if (!file || !bucket) {
      return NextResponse.json(
        { error: 'File and bucket are required' },
        { status: 400 }
      );
    }
    
    // Create a Supabase client with server-side auth for user operations
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Create a service role client for administrative operations (bucket creation)
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if the bucket exists using service role client (bypasses RLS)
    const { data: buckets, error: listError } = await serviceSupabase.storage.listBuckets();

    if (listError) {
      return NextResponse.json(
        { error: `Error listing buckets: ${listError.message}` },
        { status: 500 }
      );
    }

    // Create the bucket if it doesn't exist using service role client
    const bucketExists = buckets?.some((b: { name: string }) => b.name === bucket);
    if (!bucketExists) {
      const { error: createError } = await serviceSupabase.storage.createBucket(bucket, {
        public: true
      });

      if (createError) {
        return NextResponse.json(
          { error: `Error creating bucket: ${createError.message}` },
          { status: 500 }
        );
      }
    }
    
    // Create folder if needed
    if (folder) {
      try {
        await supabase.storage
          .from(bucket)
          .upload(`${folder}/.folder`, new Blob(['']));
      } catch (folderError: unknown) {
        // Ignore error if folder already exists
        const errorMessage = folderError instanceof Error ? folderError.message : String(folderError);
        if (!errorMessage.includes('The resource already exists')) {
          console.error('Error creating folder:', folderError);
        }
      }
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      return NextResponse.json(
        { error: `Error uploading file: ${uploadError.message}` },
        { status: 500 }
      );
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return NextResponse.json({ success: true, publicUrl });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
