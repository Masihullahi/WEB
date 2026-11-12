# ATELIER — fashion store + merchant panel
Static site (HTML/JS) + Supabase (DB, auth, image storage) → deploy on Vercel from GitHub. No build step.

## Try now
Open `index.html` (or `npx serve .`). Empty `config.js` = **Demo mode** (data saved in browser). Merchant panel: `/admin.html`.

## Go live (10 min)
1. **Supabase**: New project → SQL Editor → run `schema.sql`.
2. Authentication → Users → *Add user* (your merchant email + password; disable public sign-ups in Auth settings).
3. Project Settings → API → copy **URL** and **anon key** into `config.js` (anon key is safe to be public; RLS protects data).
4. **GitHub**: `git init && git add . && git commit -m "atelier" && git branch -M main && git remote add origin <your-repo> && git push -u origin main`
5. **Vercel**: Add New → Project → import the repo → Framework "Other" → Deploy. Every `git push` redeploys.

## Security
Visitors can only read live products and create orders. Only the logged-in merchant can read orders or change products/images (Row Level Security in `schema.sql`).
