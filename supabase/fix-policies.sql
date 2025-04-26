-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create a new policy that doesn't cause recursion
-- This policy allows anyone to read any profile (we'll rely on application-level checks for admin status)
CREATE POLICY "Anyone can read profiles" 
  ON profiles FOR SELECT 
  USING (true);

-- Alternatively, you could create a policy that only checks the user's own profile
-- CREATE POLICY "Users can read all profiles" 
--   ON profiles FOR SELECT 
--   USING (true);

-- Make sure the user is an admin
UPDATE profiles SET is_admin = true WHERE id = 'bd644197-395f-4bb2-af50-8d168f0adf03';
