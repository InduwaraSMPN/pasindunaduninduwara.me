# Supabase Setup for pasindunaduninduwara.me

This document provides instructions for setting up Supabase for the portfolio website.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Click "New Project" and use the following settings:
   - **Organization**: Your organization
   - **Project name**: pasindunaduninduwara-portfolio (or your preferred name)
   - **Database Password**: Use a strong password (save it securely)
   - **Region**: East US (Ohio) or the region closest to your users
   - **Security options**: Data API + Connection String
   - **Data API Configuration**: Use public schema for Data API (Default)
   - **Advanced Configuration**: Postgres (Default)

3. Click "Create New Project" and wait for the project to be created (this may take a few minutes)

## 2. Set Up Database Tables

1. Once your project is created, go to the SQL Editor in the Supabase dashboard
2. Create the projects table by copying the contents of `supabase/migrations/projects.sql` and running it in the SQL Editor
3. Create the blog_posts table by copying the contents of `supabase/migrations/blog_posts.sql` and running it in the SQL Editor

## 3. Configure Environment Variables

1. In the Supabase dashboard, go to Project Settings > API
2. Copy the "Project URL" and "anon public" key
3. Update your `.env.local` file with these values:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Restart your development server if it's running

## 4. Storage Setup (Optional)

If you plan to use Supabase Storage for images:

1. Go to Storage in the Supabase dashboard
2. Create a new bucket called "images"
3. Set the bucket's privacy to "Public"
4. Upload your project and blog images to this bucket
5. Update the image paths in your database to use the Supabase Storage URLs

## 5. Authentication Setup (Optional)

If you plan to add authentication to your site:

1. Go to Authentication > Settings in the Supabase dashboard
2. Configure the authentication providers you want to use (Email, Google, GitHub, etc.)
3. Update your site URL in the "Site URL" field
4. Configure any additional settings as needed

## 6. Testing Your Setup

1. Run your Next.js development server:
```bash
bun run dev
```

2. Visit http://localhost:3000 in your browser
3. Verify that your projects and blog posts are loading from Supabase

## Troubleshooting

- If you encounter CORS errors, make sure your site URL is added to the allowed origins in the Supabase dashboard (API > Settings > API Settings)
- If data isn't loading, check your browser console for errors and verify your environment variables are set correctly
- For authentication issues, check the authentication logs in the Supabase dashboard
