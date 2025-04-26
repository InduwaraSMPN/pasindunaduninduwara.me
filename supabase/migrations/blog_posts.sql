-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  thumbnail TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_blog_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_updated_at_column();

-- Insert sample data
INSERT INTO blog_posts (title, slug, content, excerpt, thumbnail, categories, published, published_at)
VALUES 
  (
    'Getting Started with Next.js and Supabase', 
    'getting-started-with-nextjs-and-supabase', 
    'Next.js is a React framework that enables server-side rendering and static site generation. Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, and storage. In this post, we will explore how to integrate these two technologies to build a modern web application.

## Setting Up Your Project

First, create a new Next.js project:

```bash
npx create-next-app my-app
cd my-app
```

Next, install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Configuring Supabase

Create a new file called `lib/supabase.js` and add the following code:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Fetching Data

Now you can use the Supabase client to fetch data from your database:

```javascript
async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*");
  
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  
  return data;
}
```

## Conclusion

Next.js and Supabase make a powerful combination for building modern web applications. With Next.js handling the frontend and Supabase providing backend services, you can focus on building features rather than infrastructure.',
    'Learn how to integrate Next.js with Supabase to build modern web applications with server-side rendering and a powerful PostgreSQL database.',
    '/blog/nextjs-supabase.jpg',
    ARRAY['Next.js', 'Supabase', 'Web Development'],
    TRUE,
    NOW()
  ),
  (
    'Designing Effective User Interfaces', 
    'designing-effective-user-interfaces', 
    'User interface design is a critical aspect of creating successful digital products. A well-designed UI can make the difference between a product that users love and one they abandon in frustration. In this post, we will explore some key principles for designing effective user interfaces.

## Clarity is Key

The most important principle of UI design is clarity. Users should never have to wonder how to use your interface. Make buttons look like buttons, links look like links, and ensure that interactive elements are easily distinguishable from non-interactive ones.

## Consistency Matters

Consistency in design creates familiarity and reduces the learning curve. Use consistent patterns, colors, and interactions throughout your application. This helps users build a mental model of how your interface works.

## Hierarchy Guides the Eye

Visual hierarchy helps users understand what''s most important on the screen. Use size, color, contrast, and spacing to create a clear hierarchy that guides users through the content in order of importance.

## Feedback Provides Confidence

Always provide feedback for user actions. This could be as simple as a button changing color when clicked or as complex as a success message after completing a form. Feedback lets users know that their action was registered and what happened as a result.

## Accessibility is Not Optional

Design with accessibility in mind from the start. This includes using sufficient color contrast, providing text alternatives for images, ensuring keyboard navigability, and supporting screen readers. Accessible design benefits all users, not just those with disabilities.

## Conclusion

Effective UI design requires a deep understanding of user needs and behaviors. By focusing on clarity, consistency, hierarchy, feedback, and accessibility, you can create interfaces that are both beautiful and functional.',
    'Explore the key principles of effective user interface design, from clarity and consistency to hierarchy and accessibility.',
    '/blog/ui-design.jpg',
    ARRAY['UI/UX', 'Design', 'Accessibility'],
    TRUE,
    NOW() - INTERVAL '2 days'
  );
