-- Quick fix for storage bucket RLS policies
-- Run this in the Supabase SQL editor to fix the upload issue immediately

-- Drop any existing conflicting policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Public bucket read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can read buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can update buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can delete buckets" ON storage.buckets;

-- Enable RLS on storage tables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read from public buckets
CREATE POLICY "Public bucket read access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id IN (
    SELECT name FROM storage.buckets WHERE public = true
  ));

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update files" 
  ON storage.objects FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" 
  ON storage.objects FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to create buckets
CREATE POLICY "Authenticated users can create buckets" 
  ON storage.buckets FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read buckets
CREATE POLICY "Authenticated users can read buckets" 
  ON storage.buckets FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to update buckets
CREATE POLICY "Authenticated users can update buckets" 
  ON storage.buckets FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete buckets
CREATE POLICY "Authenticated users can delete buckets" 
  ON storage.buckets FOR DELETE 
  USING (auth.role() = 'authenticated');
