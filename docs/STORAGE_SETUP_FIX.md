# Storage Upload Fix - RLS Policy Issue

## Problem
You're encountering this error when trying to upload images:
```
Error creating bucket: new row violates row-level security policy
```

This happens because Supabase has Row-Level Security (RLS) enabled on the `storage.objects` and `storage.buckets` tables, but no policies are set up to allow authenticated users to create buckets or upload files.

## Solution

I've created several files to fix this issue:

### 1. Quick Fix (Immediate Solution)
Run the SQL in `supabase/fix-storage-policies.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/fix-storage-policies.sql`
4. Run the query

This will:
- Enable RLS on storage tables
- Create policies that allow authenticated users to create buckets and upload files
- Allow public read access to files in public buckets

### 2. Migration Files
I've also created proper migration files for future use:

- `supabase/migrations/storage_policies.sql` - Admin-only bucket creation
- `supabase/migrations/storage_policies_simple.sql` - Any authenticated user can create buckets

### 3. Updated Upload API
I've improved the upload API route (`src/app/api/upload/route.ts`) to:
- Use service role key for bucket creation (bypasses RLS)
- Better error handling
- Proper TypeScript types

## Environment Variables Needed

Add this to your `.env.local` file if you want to use the service role approach:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

You can find your service role key in:
Supabase Dashboard → Settings → API → service_role secret

⚠️ **Warning**: Keep the service role key secure and never expose it to the client side.

## Testing

After applying the fix:

1. Try uploading an image through your admin interface
2. Check that the bucket is created successfully
3. Verify that the file uploads and you get a public URL back

## Policy Explanation

The policies created allow:

**For storage.objects (files):**
- Anyone can read files from public buckets
- Authenticated users can upload, update, and delete files

**For storage.buckets:**
- Authenticated users can create, read, update, and delete buckets

## Alternative Approaches

If you prefer more restrictive policies:

1. **Admin-only bucket creation**: Use `storage_policies.sql` instead
2. **Service role only**: Remove all policies and rely on the service role key in the API
3. **Custom policies**: Modify the policies to match your specific requirements

## Troubleshooting

If you still get errors after applying the fix:

1. Check that you're logged in as an authenticated user
2. Verify the policies were created correctly in Supabase Dashboard → Authentication → Policies
3. Check the browser console for more detailed error messages
4. Ensure your environment variables are set correctly

## Security Notes

- The current setup allows any authenticated user to create buckets
- Files in public buckets are readable by anyone
- Consider implementing more restrictive policies for production use
- Always validate file types and sizes on the server side
