-- Simple storage bucket policies for file uploads
-- This migration sets up basic RLS policies that allow authenticated users to work with storage

-- Enable RLS on storage tables (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read from public buckets
CREATE POLICY "Public bucket read access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id IN (
    SELECT name FROM storage.buckets WHERE public = true
  ));

-- Policy to allow authenticated users to upload to any bucket
CREATE POLICY "Authenticated users can upload files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to update files
CREATE POLICY "Authenticated users can update files" 
  ON storage.objects FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" 
  ON storage.objects FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to create buckets
CREATE POLICY "Authenticated users can create buckets" 
  ON storage.buckets FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to read buckets
CREATE POLICY "Authenticated users can read buckets" 
  ON storage.buckets FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to update buckets
CREATE POLICY "Authenticated users can update buckets" 
  ON storage.buckets FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete buckets
CREATE POLICY "Authenticated users can delete buckets" 
  ON storage.buckets FOR DELETE 
  USING (auth.role() = 'authenticated');
