export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: number
          title: string
          description: string
          full_description: string | null
          image: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          full_description?: string | null
          image: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          full_description?: string | null
          image?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: number
          title: string
          slug: string
          content: string
          excerpt: string | null
          thumbnail: string | null
          categories: string[]
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content: string
          excerpt?: string | null
          thumbnail?: string | null
          categories?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          thumbnail?: string | null
          categories?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          post_id: number
          name: string
          email: string
          content: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: number
          post_id: number
          name: string
          email: string
          content: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          name?: string
          email?: string
          content?: string
          approved?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          subject: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          subject?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
