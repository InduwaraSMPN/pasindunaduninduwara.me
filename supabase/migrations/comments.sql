-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
-- Anyone can read approved comments
CREATE POLICY "Anyone can read approved comments" 
  ON comments FOR SELECT 
  USING (approved = true);

-- Only admins can read all comments (including unapproved)
CREATE POLICY "Admins can read all comments" 
  ON comments FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Anyone can insert comments (they'll be unapproved by default)
CREATE POLICY "Anyone can insert comments" 
  ON comments FOR INSERT 
  WITH CHECK (true);

-- Only admins can update or delete comments
CREATE POLICY "Only admins can update comments" 
  ON comments FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Only admins can delete comments" 
  ON comments FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));
