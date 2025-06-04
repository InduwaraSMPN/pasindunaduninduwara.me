import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Create a Supabase client for the browser
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Check if a bucket exists and create it if it doesn't
export async function ensureBucketExists(bucketName: string, isPublic: boolean = true) {
  const supabase = createClient();
  
  try {
    // List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return { success: false, error: listError };
    }
    
    // Check if bucket exists
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return { success: false, error: createError };
      }
      
      console.log(`Created bucket: ${bucketName}`);
    }
    
    // Note: Bucket policies are managed through Supabase dashboard
    // The bucket is created as public, so files will be publicly accessible
    
    return { success: true };
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return { success: false, error };
  }
}

// Create a folder in a bucket if it doesn't exist
export async function ensureFolderExists(bucketName: string, folderPath: string) {
  const supabase = createClient();
  
  try {
    // Try to create the folder by uploading an empty file
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderPath}/.folder`, new Blob(['']));
    
    // Ignore error if folder already exists
    if (error && !error.message.includes('The resource already exists')) {
      console.error(`Error creating folder ${folderPath}:`, error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error ensuring folder exists:`, error);
    return { success: false, error };
  }
}

// Upload a file to Supabase Storage
export async function uploadFile(bucketName: string, filePath: string, file: File) {
  const supabase = createClient();
  
  try {
    // Upload the file
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading file:`, error);
      return { success: false, error, publicUrl: null };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return { success: true, publicUrl, data };
  } catch (error) {
    console.error(`Error uploading file:`, error);
    return { success: false, error, publicUrl: null };
  }
}
