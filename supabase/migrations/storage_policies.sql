-- Storage bucket policies for file uploads
-- This migration sets up RLS policies for storage.objects and storage.buckets

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

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update files" 
  ON storage.objects FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete files" 
  ON storage.objects FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Policy to allow admins to create buckets
CREATE POLICY "Admins can create buckets" 
  ON storage.buckets FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Policy to allow admins to read all buckets
CREATE POLICY "Admins can read buckets" 
  ON storage.buckets FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Policy to allow admins to update buckets
CREATE POLICY "Admins can update buckets" 
  ON storage.buckets FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Policy to allow admins to delete buckets
CREATE POLICY "Admins can delete buckets" 
  ON storage.buckets FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Alternative policy for bucket creation that allows any authenticated user
-- (uncomment this and comment out the admin-only policy above if you want any authenticated user to create buckets)
-- CREATE POLICY "Authenticated users can create buckets" 
--   ON storage.buckets FOR INSERT 
--   WITH CHECK (auth.role() = 'authenticated');
