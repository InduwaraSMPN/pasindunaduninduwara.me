# Storage Upload Fix - Dashboard Method

## The Problem
You're getting this error: `42501: must be owner of table objects`

This happens because your database user doesn't have permission to create policies on the `storage.objects` table, which is owned by `supabase_storage_admin`.

## ✅ Solution (Using Supabase Dashboard)

Since I've already set up your service role key in `.env.local`, your upload API will now bypass RLS entirely for bucket creation. However, you still need to set up basic storage policies for file access.

### Step 1: Enable Storage Policies in Dashboard

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to Storage → Settings**
3. **Make sure "Enable RLS for storage.objects" is checked**

### Step 2: Create Storage Policies

1. **Go to Storage → Policies**
2. **Click "New Policy" for storage.objects**
3. **Create these policies:**

#### Policy 1: Public Read Access
- **Policy Name:** `Public bucket read access`
- **Allowed Operation:** `SELECT`
- **Target Roles:** `public`
- **Policy Definition:**
```sql
bucket_id IN (
  SELECT name FROM storage.buckets WHERE public = true
)
```

#### Policy 2: Authenticated Upload
- **Policy Name:** `Authenticated users can upload`
- **Allowed Operation:** `INSERT`
- **Target Roles:** `authenticated`
- **Policy Definition:**
```sql
auth.role() = 'authenticated'
```

#### Policy 3: Authenticated Update
- **Policy Name:** `Authenticated users can update`
- **Allowed Operation:** `UPDATE`
- **Target Roles:** `authenticated`
- **Policy Definition:**
```sql
auth.role() = 'authenticated'
```

#### Policy 4: Authenticated Delete
- **Policy Name:** `Authenticated users can delete`
- **Allowed Operation:** `DELETE`
- **Target Roles:** `authenticated`
- **Policy Definition:**
```sql
auth.role() = 'authenticated'
```

### Step 3: Test the Upload

1. **Restart your development server** (if running)
2. **Try uploading an image** through your admin interface
3. **The upload should now work** because:
   - Bucket creation uses service role key (bypasses RLS)
   - File uploads use the policies you just created

## ✅ Alternative: Service Role Only (Simpler)

If you don't want to deal with policies at all, you can modify the upload API to use the service role for all operations:

The current implementation already uses service role for bucket creation. If you want to use it for file uploads too, I can modify the API route.

## 🔧 Current Setup

Your upload API now:
- ✅ Uses service role key for bucket creation (bypasses RLS)
- ✅ Uses authenticated user context for file uploads (respects RLS)
- ✅ Has proper TypeScript types
- ✅ Handles errors gracefully

## 🧪 Testing

After setting up the policies:

1. Log into your admin panel
2. Try uploading an image
3. Check that:
   - Bucket is created successfully
   - File uploads without errors
   - You get a public URL back
   - The image is accessible via the URL

## 🚨 If You Still Get Errors

If you still encounter issues:

1. **Check Authentication**: Make sure you're logged in as an admin user
2. **Check Policies**: Verify the policies were created correctly in the dashboard
3. **Check Console**: Look for detailed error messages in the browser console
4. **Check Logs**: Check the Supabase logs in the dashboard

## 📝 Notes

- The service role key bypasses all RLS policies
- Keep the service role key secure and never expose it to the client
- The policies I've suggested are permissive - adjust them based on your security needs
- Public buckets allow anyone to read files, but only authenticated users can upload
