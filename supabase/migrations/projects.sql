-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  image TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO projects (title, description, full_description, image, tags)
VALUES 
  (
    'E-commerce Website Redesign', 
    'A complete redesign of an e-commerce platform focusing on user experience and conversion optimization.', 
    'This project involved a comprehensive redesign of an e-commerce platform to improve user experience and increase conversion rates. The client was experiencing high bounce rates and low conversion despite having quality products. My approach included extensive user research, wireframing, prototyping, and A/B testing to create a more intuitive and engaging shopping experience.',
    '/placeholder-project-1.jpg',
    ARRAY['UI/UX', 'Web Design', 'E-commerce']
  ),
  (
    'Mobile Banking App', 
    'A modern mobile banking application with a focus on security and ease of use.', 
    'Designed and developed a mobile banking application that prioritizes both security and user experience. The app includes features like biometric authentication, real-time transaction notifications, spending analytics, and bill payment services. The design follows a clean, minimalist aesthetic with clear visual hierarchy to make financial management intuitive for users of all ages.',
    '/placeholder-project-2.jpg',
    ARRAY['Mobile Design', 'UI/UX', 'Fintech']
  ),
  (
    'Corporate Brand Identity', 
    'Complete brand identity design for a technology startup, including logo, color palette, typography, and brand guidelines.', 
    'Created a comprehensive brand identity for a technology startup entering the competitive SaaS market. The project included market research, competitor analysis, and stakeholder interviews to develop a distinctive visual identity that would stand out in the industry. Deliverables included a versatile logo system, custom typography, a distinctive color palette, and detailed brand guidelines to ensure consistent application across all touchpoints.',
    '/placeholder-project-3.jpg',
    ARRAY['Branding', 'Logo Design', 'Identity']
  );
