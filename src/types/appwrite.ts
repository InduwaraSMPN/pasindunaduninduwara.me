import { Models } from 'appwrite';

export interface Profile extends Models.Document {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project extends Models.Document {
  title: string;
  description: string;
  full_description: string | null;
  image: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogPost extends Models.Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  categories: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment extends Models.Document {
  post_id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  created_at: string;
}

export interface Message extends Models.Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}
