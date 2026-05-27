# CLAUDE.md — Jocky Website Project

## 1. Project Overview

Project name: `jocky-website`  
Domain: `https://jocky.website`  
Purpose: Personal blog / articles / diary / journal-style website.

This project is intended to be a personal publishing platform where the owner can write notes, thoughts, articles, diary entries, and long-form posts without relying on WordPress.

The user originally considered Astro, but later decided to move to a **Next.js + Database based CMS** because the user is more familiar with WordPress-style workflows such as:

- Add Post
- Edit Post
- Manage Posts
- Categories / Tags
- Admin dashboard
- WYSIWYG editor
- Database-backed content management

The goal is to build a lightweight custom CMS that feels similar to WordPress in usability, but remains simpler, cleaner, and fully controlled by the project owner.

---

## 2. User / Owner Context

The project owner is “เต้อ”.

Preferred working style:

- Explain things clearly step-by-step.
- Avoid jumping back and forth between conflicting approaches.
- Prefer practical commands that can be copied and pasted.
- Prefer stable, maintainable implementation over over-engineered architecture.
- If the file structure or current code state is uncertain, inspect the actual files first instead of guessing.
- When editing code, preserve existing working behavior unless explicitly changing it.
- The user is comfortable with VPS, HestiaCP, GitHub, SSH, database creation, and deployment, but prefers AI assistance for coding and architecture.

---

## 3. Tech Stack

Current intended stack:

- Framework: Next.js
- Language: TypeScript / JavaScript
- Styling: likely Tailwind CSS or standard CSS depending on current setup
- Database ORM: Prisma
- Database: MariaDB / MySQL
- Hosting: VPS with HestiaCP
- Web server: Nginx / Hestia managed domain config
- Source control: GitHub
- Deployment: Git pull / build / copy or serve from app directory depending on final deployment setup

Important note:

MariaDB can use Prisma provider:

```prisma
provider = "mysql"
```

This is correct for MariaDB.

---

## 4. Repository / Local / VPS Details

### GitHub Repository

```txt
https://github.com/atiroop/jocky-website.git
```

### Local Project Folder

```txt
D:\CODEX_JOCKY
```

### VPS Public Web Path

```txt
/home/jocky/web/jocky.website/public_html/
```

### VPS App Working Directory

The active app/project directory used during development on VPS appears to be:

```txt
/home/jocky/apps/jocky-website
```

Before making changes, always verify with:

```bash
pwd
ls -la
git status
```

Expected project repo path on VPS:

```bash
cd /home/jocky/apps/jocky-website
```

---

## 5. Deployment / Server Notes

The VPS is managed with HestiaCP.

The domain public web root is:

```txt
/home/jocky/web/jocky.website/public_html/
```

The application source code is kept separately in:

```txt
/home/jocky/apps/jocky-website
```

This separation is intentional:

- `/home/jocky/apps/jocky-website` = source code / Git repo / build source
- `/home/jocky/web/jocky.website/public_html/` = public website output or production target

Before deploying, confirm the current deployment strategy from existing files.

Potential deployment flow may be:

```bash
cd /home/jocky/apps/jocky-website
git pull origin main
npm install
npm run build
```

Then either:

1. Run the Next.js app with Node/PM2/systemd, or  
2. Export/copy static build output to public_html if the site is configured as static export.

Do not assume which deployment mode is active. Inspect these files first:

```bash
cat package.json
cat next.config.*
ls -la
ls -la /home/jocky/web/jocky.website/public_html/
```

Also check whether a process manager is already used:

```bash
pm2 list
systemctl status jocky-website
ps aux | grep node
```

---

## 6. Important Development Rule

Before modifying code, always inspect the existing file structure.

Useful commands:

```bash
cd /home/jocky/apps/jocky-website

find . -maxdepth 3 -type f | sort
git status
cat package.json
```

For app routes:

```bash
find app -maxdepth 5 -type f | sort
```

For Prisma:

```bash
find prisma -maxdepth 3 -type f -print
cat prisma/schema.prisma
```

Do not invent missing files. If a page or API route does not exist, create it deliberately and document what was added.

---

## 7. Current Project Direction

The project is being developed into a custom CMS with an admin area.

The desired admin features are similar to WordPress:

- Login / admin access
- Post list
- Add new post
- Edit post
- Delete post
- Rich text editor / WYSIWYG editor
- Draft / published status
- Slug
- Title
- Content
- Created date
- Updated date
- SEO fields later
- Category / tag system later

---

## 8. Work Already Done / Discussed

### 8.1 Project Direction

The project started from the idea of a personal blog/articles/diary website.

Astro was considered first, but the user decided that command-line content management is not convenient enough.

The project direction changed to:

```txt
Next.js + Database + Custom Admin CMS
```

Reason:

The user wants a WordPress-like writing experience with an admin panel.

---

### 8.2 GitHub / Local / VPS Setup

Known details:

```txt
Local folder:
D:\CODEX_JOCKY

GitHub:
https://github.com/atiroop/jocky-website.git

VPS public path:
/home/jocky/web/jocky.website/public_html/

VPS app path:
/home/jocky/apps/jocky-website
```

The app should be kept under Git control and pushed to GitHub regularly.

Always check:

```bash
git status
git branch
git remote -v
```

---

### 8.3 Database Setup

The user already prepared a database through HestiaCP.

The database is MariaDB.

For Prisma, use:

```prisma
provider = "mysql"
```

Do not use PostgreSQL unless the user explicitly changes database strategy.

Sensitive database credentials should be stored in `.env`, not committed to Git.

Example:

```env
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME"
```

Never expose real passwords in committed files.

---

### 8.4 Prisma

Plan discussed:

1. Create Prisma `Post` model.
2. Run:

```bash
npx prisma db push
```

3. Create admin posts API route.
4. Create admin posts page.
5. Create new post page.
6. Add WYSIWYG editor.

Likely model shape:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  content   String   @db.LongText
  excerpt   String?  @db.Text
  status    String   @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Before applying, inspect the current `prisma/schema.prisma`.

---

### 8.5 Admin Posts Feature

Target admin routes:

```txt
/admin/posts
/admin/posts/new
/admin/posts/[id]/edit
```

Target API routes:

```txt
/api/admin/posts
/api/admin/posts/[id]
```

Expected features:

- List posts
- Create post
- Edit post
- Delete post
- Save as draft
- Publish post
- Auto-generate slug from title
- Store content in database

The user tested posting once and it appeared to work, but the current status should be verified by reading the actual files and checking the database.

---

### 8.6 WYSIWYG / Rich Text Editor

The user wants the content input on:

```txt
https://jocky.website/admin/posts/new
```

to be a WYSIWYG editor, not a plain textarea.

A rich text editor was attempted, but the user reported that it was not visible at first.

When continuing this work, verify:

```bash
find app/admin/posts -maxdepth 5 -type f -print
find components -maxdepth 5 -type f -print
cat package.json
```

Possible editor choices:

- TipTap
- React Quill
- TinyMCE
- Lexical

Recommended for this project:

```txt
TipTap
```

Reason:

- Modern React support
- Good Next.js compatibility when loaded client-side
- Flexible
- No external editor account required
- Can output HTML

Important Next.js note:

Rich text editors usually need to be client components.

Use:

```tsx
"use client";
```

Also avoid SSR issues by dynamically importing the editor component when necessary.

---

## 9. Recommended Folder Structure

Use a clean structure like:

```txt
app/
  page.tsx
  admin/
    page.tsx
    posts/
      page.tsx
      new/
        page.tsx
      [id]/
        edit/
          page.tsx
  api/
    admin/
      posts/
        route.ts
        [id]/
          route.ts

components/
  admin/
    PostEditor.tsx
    PostsTable.tsx
  ui/

lib/
  prisma.ts
  slug.ts
  auth.ts

prisma/
  schema.prisma

public/
```

---

## 10. Prisma Client Helper

Recommended file:

```txt
lib/prisma.ts
```

Example pattern:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

This prevents too many Prisma clients during development.

---

## 11. Admin CMS Roadmap

### Phase 1 — Basic Post CMS

Goal: Make the admin post system usable.

Tasks:

- Confirm database connection.
- Confirm Prisma schema.
- Confirm `/admin/posts` page exists.
- Confirm `/admin/posts/new` works.
- Confirm post creation stores data in database.
- Confirm post list reads from database.
- Add edit page.
- Add delete function.
- Add publish/draft status.
- Add slug generation.
- Add basic validation.

Expected result:

The user can create and manage posts from the browser.

---

### Phase 2 — Rich Text Editor

Goal: Replace textarea with WYSIWYG editor.

Tasks:

- Install editor library.
- Create `PostEditor` client component.
- Add toolbar:
  - Bold
  - Italic
  - Headings
  - Bullet list
  - Numbered list
  - Quote
  - Link
  - Undo / redo
- Save HTML content to database.
- Render post content safely on frontend.

Expected result:

Writing posts feels closer to WordPress.

---

### Phase 3 — Public Blog Pages

Goal: Render published posts publicly.

Routes:

```txt
/blog
/blog/[slug]
```

Tasks:

- Create public blog index page.
- Query only `published` posts.
- Sort by newest first.
- Create single post page by slug.
- Render title, date, content.
- Add simple SEO metadata.
- Add not-found handling.
- Add draft protection.

Expected result:

Published posts appear publicly on the website.

---

### Phase 4 — Admin Authentication

Goal: Protect `/admin`.

Options:

1. Simple password/session auth
2. NextAuth/Auth.js
3. Custom credentials login

Recommended initial approach:

```txt
Simple admin login first, then improve later.
```

Tasks:

- Create login page.
- Add session cookie.
- Protect admin routes.
- Add logout.
- Prevent unauthenticated access to admin pages and APIs.
- Store admin credentials securely.
- Do not hardcode passwords.

Expected result:

Only the owner can access CMS.

---

### Phase 5 — Categories and Tags

Add models:

```prisma
model Category {
  id    Int    @id @default(autoincrement())
  name  String
  slug  String @unique
  posts Post[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String
  slug  String @unique
  posts Post[]
}
```

Actual Prisma relation design should be reviewed before implementation.

Tasks:

- Category CRUD
- Tag CRUD
- Assign categories/tags to posts
- Filter public blog by category/tag

---

### Phase 6 — Media Uploads

Goal: Upload and insert images into posts.

Tasks:

- Add media upload API.
- Store uploaded files under public uploads directory or external storage.
- Insert image into WYSIWYG editor.
- Add featured image field to `Post`.
- Add image validation.
- Prevent unsafe file uploads.

Possible `Post` field:

```prisma
featuredImage String?
```

---

### Phase 7 — SEO / OG Image

Tasks:

- Add meta title
- Add meta description
- Add OG image
- Add canonical URL
- Add sitemap
- Add RSS feed
- Add robots.txt

Potential post fields:

```prisma
metaTitle       String?
metaDescription String?
ogImage         String?
```

---

### Phase 8 — Polish Admin UX

Tasks:

- Better dashboard layout
- Sidebar navigation
- Post search
- Status filter
- Pagination
- Autosave draft
- Last saved indicator
- Preview post
- Confirm before delete
- Toast notifications
- Loading states
- Error states

---

## 12. Coding Guidelines

### General

- Keep code simple and maintainable.
- Avoid over-engineering.
- Prefer readable functions over clever abstractions.
- Do not rewrite the whole project unless necessary.
- Preserve working code.
- Use TypeScript types where practical.
- Validate server-side input.
- Never trust client input.
- Keep secrets in `.env`.

### Git

Before changes:

```bash
git status
```

After changes:

```bash
git diff
npm run build
git status
```

Recommended commit format:

```bash
git add .
git commit -m "Add admin post editor"
git push origin main
```

### Do Not Commit

Never commit:

```txt
.env
.env.local
node_modules/
.next/
dist/
build/
*.log
```

---

## 13. Commands to Use Frequently

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Prisma generate

```bash
npx prisma generate
```

### Push schema to database

```bash
npx prisma db push
```

### Inspect database with Prisma Studio

```bash
npx prisma studio
```

Only use Prisma Studio locally or safely tunneled; do not expose it publicly.

---

## 14. Things to Verify Before Continuing

When Claude Code takes over, first run:

```bash
cd /home/jocky/apps/jocky-website

pwd
git status
git remote -v
cat package.json
find app -maxdepth 5 -type f | sort
find components -maxdepth 5 -type f | sort
find prisma -maxdepth 3 -type f | sort
cat prisma/schema.prisma
```

Then check whether these exist:

```txt
app/admin/posts/page.tsx
app/admin/posts/new/page.tsx
app/api/admin/posts/route.ts
lib/prisma.ts
prisma/schema.prisma
```

If `app/admin/posts` does not exist, create it.

If the WYSIWYG editor is not visible, inspect browser console and Next.js server logs.

---

## 15. Known Issues / Things to Watch

### 15.1 Rich Text Editor Not Showing

The user reported that the rich text editor was not visible.

Possible causes:

- Component not marked as client component.
- Editor library incompatible with SSR.
- Missing CSS import.
- Dynamic import needed.
- JavaScript error in browser console.
- Editor component not actually rendered.
- Route file not deployed.
- Build cache or old deployment still being served.

Troubleshooting:

```bash
npm run build
npm run dev
```

Check browser console.

Also inspect:

```bash
cat app/admin/posts/new/page.tsx
find components -maxdepth 5 -type f | sort
```

---

### 15.2 Files Missing on VPS

At one point this command returned:

```bash
find app/admin/posts -maxdepth 3 -type f -print
```

Result:

```txt
find: ‘app/admin/posts’: No such file or directory
```

So never assume the admin posts folder exists. Always verify.

---

### 15.3 Deployment Confusion

The project has both:

```txt
/home/jocky/apps/jocky-website
/home/jocky/web/jocky.website/public_html/
```

Make sure code changes are made in the Git repo app directory, not only in public_html.

Confirm which directory is actually being served.

---

## 16. Suggested Next Immediate Tasks

Start with these in order:

### Step 1 — Audit Current Codebase

Run:

```bash
cd /home/jocky/apps/jocky-website
git status
cat package.json
find app -maxdepth 5 -type f | sort
find prisma -maxdepth 3 -type f | sort
```

Summarize what currently exists.

---

### Step 2 — Confirm Database + Prisma

Check:

```bash
cat .env
cat prisma/schema.prisma
npx prisma generate
npx prisma db push
```

Do not print real credentials in logs or commits.

---

### Step 3 — Build Admin Posts CRUD

Create or verify:

```txt
app/admin/posts/page.tsx
app/admin/posts/new/page.tsx
app/admin/posts/[id]/edit/page.tsx
app/api/admin/posts/route.ts
app/api/admin/posts/[id]/route.ts
```

Minimum fields:

```txt
title
slug
content
status
createdAt
updatedAt
```

---

### Step 4 — Add WYSIWYG Editor

Recommended:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
```

Create:

```txt
components/admin/PostEditor.tsx
```

Make it a client component:

```tsx
"use client";
```

Use it inside:

```txt
app/admin/posts/new/page.tsx
app/admin/posts/[id]/edit/page.tsx
```

---

### Step 5 — Create Public Blog

Create:

```txt
app/blog/page.tsx
app/blog/[slug]/page.tsx
```

Only show posts where:

```txt
status = "published"
```

---

### Step 6 — Add Admin Protection

After CRUD works, add auth.

Do not leave `/admin` publicly writable.

---

## 17. Long-Term Product Vision

The final version should become a personal writing platform with:

- Clean public blog
- Admin CMS
- Rich text editor
- Draft/publish workflow
- Categories/tags
- Featured images
- SEO fields
- OG images
- RSS feed
- Sitemap
- Simple analytics later
- Personal diary/private post mode later

The user wants this to feel like a lightweight personal WordPress alternative, but built with Next.js and owned fully by the user.

---

## 18. Communication Preference for Claude Code

When working with the user:

- Explain what you are going to do before doing major changes.
- After inspecting files, summarize what you found.
- Give copy-paste commands.
- Avoid vague answers.
- Do not claim a file exists unless you checked it.
- Do not silently change architecture.
- Ask before deleting or replacing large sections.
- Prefer incremental commits.
- If something fails, show the exact error and the next fix.

---

## 19. Safe Handling of Secrets

Do not expose or commit:

- Database password
- `.env`
- API keys
- SSH keys
- HestiaCP credentials
- GitHub tokens

Use placeholders in documentation:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE"
```

---

## 20. Current Priority

The current top priority is:

```txt
Make the custom Admin CMS usable for writing posts, with a working WYSIWYG editor, database-backed post storage, and public blog display.
```

Recommended next build order:

1. Verify current files.
2. Fix or create Prisma Post model.
3. Build admin post list.
4. Build create post page.
5. Add WYSIWYG editor.
6. Build edit post page.
7. Build public blog page.
8. Add admin auth.
9. Add categories/tags.
10. Add media upload and SEO.
