# Pasindu Nadun Induwara - Portfolio Website

A modern, full-stack portfolio website showcasing projects, blog posts, and professional experience. Built with Next.js 15, TypeScript, and Supabase.

🌐 **Live Site**: [pasindunaduninduwara.me](https://pasindunaduninduwara.me)

## ✨ Features

### 🎨 Frontend
- **Modern Design**: Clean, responsive UI with dark/light theme support
- **Hero Section**: Professional introduction with downloadable CV
- **Projects Showcase**: Dynamic project gallery with detailed views
- **Blog System**: Full-featured blog with categories and comments
- **Contact Form**: Direct messaging system with form validation
- **Admin Dashboard**: Content management system for projects and blog posts

### 🔧 Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom components
- **Supabase**: Backend-as-a-Service for database, auth, and storage
- **React Query**: Data fetching and caching
- **Authentication**: Secure admin login with role-based access
- **File Upload**: Image management for projects and blog posts
- **Responsive Design**: Mobile-first approach with modern UI components

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (latest)
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pasindunaduninduwara.me.git
   cd pasindunaduninduwara.me
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```

   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) for detailed instructions
   - Run the provided SQL migrations in your Supabase dashboard

5. **Start Development Server**
   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server on port 3000
bun run dev:watch        # Development with watch mode
bun run dev:hot          # Development with hot reload

# Production
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint

# Custom Server
bun run server           # Run custom Bun server
bun run server:watch     # Custom server with watch mode
bun run server:hot       # Custom server with hot reload
```

### Bun Watch & Hot Reload

This project includes enhanced development scripts using Bun's watch and hot reload features:

- **`--watch` mode**: Hard restarts the entire process when files change
- **`--hot` mode**: Soft reloads code without restarting, preserving state

Try making changes to see the different reload behaviors in action.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── projects/          # Project pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── auth/             # Authentication components
│   ├── blog/             # Blog-specific components
│   └── admin/            # Admin-specific components
├── lib/                  # Utility functions and services
├── providers/            # React context providers
└── types/                # TypeScript type definitions
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- **`projects`**: Portfolio projects with images and descriptions
- **`blog_posts`**: Blog articles with categories and content
- **`comments`**: Blog post comments system
- **`messages`**: Contact form submissions
- **`profiles`**: User profiles with admin roles

## 🔐 Authentication & Admin

### Admin Access
- Secure authentication using Supabase Auth
- Role-based access control with `is_admin` flag
- Protected admin routes with middleware

### Admin Features
- **Projects Management**: Create, edit, delete projects
- **Blog Management**: Write and publish blog posts
- **Comments Moderation**: Manage blog comments
- **Messages**: View contact form submissions
- **File Upload**: Manage images and assets

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Responsive design system
- Dark/light theme support
- Accessible components
- Custom styling with Tailwind CSS

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Pasindu Nadun Induwara**
- Website: [pasindunaduninduwara.me](https://pasindunaduninduwara.me)
- Email: [your-email@example.com](mailto:pasindunaduninduwara@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/induwarasmpn/](https://www.linkedin.com/in/induwarasmpn/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icons
- [Vercel](https://vercel.com/) - Deployment platform
