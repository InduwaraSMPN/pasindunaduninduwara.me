# Supabase to Appwrite Migration Plan

## Context
Portfolio/blog site on Next.js uses Supabase for auth, database (5 tables), and storage. Supabase project paused 90+ days, can't use Appwrite migration wizard. User will seed data manually. Migrating all at once to Appwrite Cloud with email/password auth.

---

## Phase 0: Appwrite Cloud Setup (Manual - Console)

### 0.1 Create Project
- Note Project ID

### 0.2 Create Database (`portfolio_db`)

### 0.3 Create 5 Collections

**`profiles`**: email (string), full_name (string), avatar_url (string), is_admin (boolean), created_at (datetime), updated_at (datetime)

**`projects`**: title (string), description (string/5000), full_description (string/50000), image (string/2048), tags (string[]), created_at, updated_at

**`blog_posts`**: title (string), slug (string, unique index), content (string/1000000), excerpt (string/5000), thumbnail (string/2048), categories (string[]), published (boolean), published_at (datetime), created_at, updated_at. Indexes: slug (unique), published, [published, published_at]

**`comments`**: post_id (string), name (string), email (string), content (string/10000), approved (boolean), created_at. Indexes: post_id, [post_id, approved]

**`messages`**: name (string), email (string), subject (string/500), message (string/10000), read (boolean), created_at

### 0.4 Collection Permissions
- `projects`, `blog_posts`: Read=any, CUD=team:admin
- `comments`: Read=any, Create=any, UD=team:admin
- `messages`: Read=team:admin, Create=any, UD=team:admin
- `profiles`: Read=any, CUD=team:admin

### 0.5 Create Auth User + add `admin` label

### 0.6 Create Storage Bucket `images` (Read=any, CUD=team:admin)

### 0.7 Seed sample data manually

---

## Phase 1: Dependencies & Environment

### 1.1 Swap packages
```
bun remove @supabase/ssr @supabase/supabase-js
bun add appwrite node-appwrite
```

### 1.2 Update `.env.local`
Replace Supabase vars with:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<project-id>
APPWRITE_API_KEY=<server-api-key>
NEXT_PUBLIC_APPWRITE_DATABASE_ID=portfolio_db
NEXT_PUBLIC_APPWRITE_BUCKET_ID=images
```

---

## Phase 2: Core Library Files

### 2.1 Create `src/types/appwrite.ts`
- Define Profile, Project, BlogPost, Comment, Message interfaces extending `Models.Document`
- Key change: IDs become strings (`$id` instead of `id: number`)

### 2.2 Create `src/lib/appwrite.ts` (replaces `supabase.ts`)
- Client-side: `Client`, `Account`, `Databases`, `Storage` from `appwrite`
- Server-side: `createServerClient()` using API key (for admin ops)
- Session client: `createSessionClient(cookie)` for authenticated user context
- Helper: `getCurrentUser()`, `isAdmin()` using user labels

### 2.3 Create `src/lib/blog-service.ts` (replaces `blog-service-supabase.ts`)
- `fetchBlogPosts()` → `databases.listDocuments()` with `Query.equal('published', true)`, `Query.orderDesc('published_at')`
- `fetchBlogPostBySlug()` → `Query.equal('slug', slug)` + `.documents[0]`
- Keep React Query hooks (`useBlogPosts`, `useBlogPost`)

### 2.4 Update `src/lib/project-service.ts`
- Same pattern: `listDocuments` / `getDocument` replacing Supabase queries

### 2.5 Create `src/lib/appwrite-storage.ts` (replaces `supabase-storage.ts`)
- `uploadFile()` → `storage.createFile(BUCKET_ID, ID.unique(), file)`
- Public URL → `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
- No bucket/folder creation needed (flat storage, pre-created bucket)

---

## Phase 3: Authentication

### 3.1 Update `src/components/auth/login-form.tsx`
- `signInWithPassword()` → `account.createEmailPasswordSession(email, password)`
- After login, call API route to set session cookie

### 3.2 Create `src/app/api/auth/login/route.ts` (new)
- Receive email/password, create session, set `appwrite-session` cookie

### 3.3 Update `src/app/api/auth/signout/route.ts`
- `account.deleteSession('current')` + clear cookie

### 3.4 Update `src/middleware.ts`
- Read `appwrite-session` cookie
- Create session client, call `account.get()` to verify
- Protect `/admin/*`, redirect `/login` if authenticated

---

## Phase 4: API Routes

All follow same pattern: read session cookie → verify auth → check admin label → perform operation.

| Route | Operation |
|-------|-----------|
| `api/blog/[id]/publish` | `updateDocument(DB, 'blog_posts', id, {published: true, published_at: now})` |
| `api/blog/[id]/unpublish` | `updateDocument(DB, 'blog_posts', id, {published: false})` |
| `api/blog/[id]/delete` | `deleteDocument(DB, 'blog_posts', id)` |
| `api/comments/[id]/approve` | `updateDocument(DB, 'comments', id, {approved: true})` |
| `api/comments/[id]/delete` | `deleteDocument(DB, 'comments', id)` |
| `api/messages/[id]/mark-read` | `updateDocument(DB, 'messages', id, {read: true})` |
| `api/messages/[id]/delete` | `deleteDocument(DB, 'messages', id)` |
| `api/projects/[id]/delete` | `deleteDocument(DB, 'projects', id)` |
| `api/upload` | `storage.createFile(BUCKET_ID, ID.unique(), file)` |

---

## Phase 5: Admin Pages (Server Components)

### Key changes across all admin pages:
- Auth: `account.get()` instead of `supabase.auth.getUser()`
- Admin check: `users.get(userId)` → check `labels.includes('admin')`
- Counts: `listDocuments(DB, collection, [Query.limit(1)])` → read `result.total`
- No joins: comments page must fetch blog_posts separately and join client-side

### Files:
- `src/app/admin/layout.tsx` - Auth + admin gate
- `src/app/admin/page.tsx` - Dashboard stats via `result.total`
- `src/app/admin/blog/page.tsx` - List posts
- `src/app/admin/projects/page.tsx` - List projects
- `src/app/admin/comments/page.tsx` - List comments (no joins, fetch posts separately)
- `src/app/admin/messages/page.tsx` - List messages
- `src/app/admin/storage/page.tsx` - List files from bucket

---

## Phase 6: Client Components

- `src/components/contact-form.tsx` → `databases.createDocument(DB, 'messages', ID.unique(), data)`
- `src/components/blog/comment-form.tsx` → `databases.createDocument(DB, 'comments', ID.unique(), data)`
- `src/components/blog/comments-list.tsx` → `databases.listDocuments()` with filters
- `src/components/supabase-blog-posts.tsx` → rename to `blog-posts.tsx`, update imports
- Admin create/edit pages for blog and projects → `createDocument` / `updateDocument`

---

## Phase 7: Public Pages

- `src/app/blog/page.tsx` - Uses migrated blog service
- `src/app/blog/[slug]/page.tsx` - Server-side fetch by slug
- `src/app/projects/page.tsx` - Uses migrated project service
- `src/app/projects/[id]/page.tsx` - `getDocument` by ID
- `src/app/page.tsx` - Import path update for renamed component

---

## Phase 8: Cleanup

**Delete:**
- `src/lib/supabase.ts`
- `src/lib/supabase-storage.ts`
- `src/lib/supabase-policies.ts`
- `src/lib/blog-service-supabase.ts`
- `src/types/supabase.ts`
- `supabase/` directory
- `src/app/api/upload/test/route.ts` (if only for debugging)

**Update:**
- `next.config.ts` - Update image domains if referencing Supabase
- All imports referencing renamed/deleted files

---

## Key Gotchas

1. **IDs**: integer → string (`$id`). Affects types, URL params, foreign keys
2. **No joins**: Comments page needs separate blog_posts fetch + client-side join
3. **Counts**: Use `result.total` from `listDocuments` with `Query.limit(1)`
4. **Flat storage**: No folders in Appwrite buckets
5. **Session cookies**: Must handle manually (set on login, clear on logout)
6. **Query limit**: Default 25, max 5000. Set explicit `Query.limit()` 
7. **Content size**: Set `blog_posts.content` attribute to 1MB

---

## Verification

1. `bun run build` - No TypeScript errors
2. Login flow - Email/password → session cookie set → admin access works
3. Public pages - Blog posts, projects load correctly
4. Admin CRUD - Create/edit/delete blog posts, projects
5. Comments - Public submission + admin approval
6. Contact form - Message submission + admin read
7. File upload - Upload image, get public URL, display correctly
8. Middleware - Unauthenticated users redirected from `/admin`
