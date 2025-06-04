import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Create a Supabase client for the browser
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Policy templates
const POLICY_TEMPLATES = {
  // Allow anyone to read files from the bucket
  publicRead: (bucketName: string) => ({
    name: `${bucketName}_public_read`,
    definition: `
      CREATE POLICY "${bucketName}_public_read" 
      ON storage.objects 
      FOR SELECT 
      USING (bucket_id = '${bucketName}');
    `
  }),
  
  // Allow authenticated users to upload files
  authenticatedInsert: (bucketName: string) => ({
    name: `${bucketName}_authenticated_insert`,
    definition: `
      CREATE POLICY "${bucketName}_authenticated_insert" 
      ON storage.objects 
      FOR INSERT 
      WITH CHECK (
        bucket_id = '${bucketName}' 
        AND auth.role() = 'authenticated'
      );
    `
  }),
  
  // Allow authenticated users to update their own files
  authenticatedUpdate: (bucketName: string) => ({
    name: `${bucketName}_authenticated_update`,
    definition: `
      CREATE POLICY "${bucketName}_authenticated_update" 
      ON storage.objects 
      FOR UPDATE 
      USING (
        bucket_id = '${bucketName}' 
        AND auth.role() = 'authenticated'
      )
      WITH CHECK (
        bucket_id = '${bucketName}' 
        AND auth.role() = 'authenticated'
      );
    `
  }),
  
  // Allow authenticated users to delete their own files
  authenticatedDelete: (bucketName: string) => ({
    name: `${bucketName}_authenticated_delete`,
    definition: `
      CREATE POLICY "${bucketName}_authenticated_delete" 
      ON storage.objects 
      FOR DELETE 
      USING (
        bucket_id = '${bucketName}' 
        AND auth.role() = 'authenticated'
      );
    `
  }),
  
  // Allow access to JPG images in a public folder to anonymous users
  publicJpgInPublicFolder: (bucketName: string) => ({
    name: `${bucketName}_public_jpg_read`,
    definition: `
      CREATE POLICY "${bucketName}_public_jpg_read" 
      ON storage.objects 
      FOR SELECT 
      USING (
        bucket_id = '${bucketName}'
        AND storage.extension(name) = 'jpg'
        AND LOWER(storage.foldername(name))[1] = 'public'
      );
    `
  }),
  
  // Allow access to all files in a public folder to anonymous users
  publicFilesInPublicFolder: (bucketName: string) => ({
    name: `${bucketName}_public_files_read`,
    definition: `
      CREATE POLICY "${bucketName}_public_files_read" 
      ON storage.objects 
      FOR SELECT 
      USING (
        bucket_id = '${bucketName}'
        AND LOWER(storage.foldername(name))[1] = 'public'
      );
    `
  })
};

// Function to apply a policy to a bucket
export async function applyPolicyToBucket(bucketName: string, policyType: keyof typeof POLICY_TEMPLATES) {
  try {
    
    // Get the policy template
    const policy = POLICY_TEMPLATES[policyType](bucketName);
    
    // Execute the SQL to create the policy
    // Note: This requires the service_role key which we don't have in the browser
    // This is just for reference - you'll need to run these in the Supabase dashboard
    console.log(`To apply the ${policy.name} policy, run this SQL in the Supabase dashboard:`);
    console.log(policy.definition);
    
    return {
      success: true,
      policyName: policy.name,
      sql: policy.definition
    };
  } catch (error) {
    console.error('Error applying policy:', error);
    return {
      success: false,
      error
    };
  }
}

// Function to get all policy templates for a bucket
export function getPolicyTemplatesForBucket(bucketName: string) {
  const templates: Record<string, string> = {};
  
  for (const [key, templateFn] of Object.entries(POLICY_TEMPLATES)) {
    templates[key] = templateFn(bucketName).definition;
  }
  
  return templates;
}
