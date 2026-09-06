# Portfolio App — setup

Two accounts have to be configured by hand before login and uploads work.

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (the free tier is enough to start).
2. Run the migrations in `supabase/migrations/` in order, using the SQL Editor:
   - `0001_initial_schema.sql` — tables, row level security, the 4-images-per-project rule
   - `0002_storage.sql` — the `portfolio-media` bucket and its access policies
3. Copy **Project URL** and the **anon public** key from Settings → API into `.env.local`
   (see `.env.example` for the variable names).

The service role key is deliberately not used anywhere. Everything goes through row
level security so a leaked key cannot expose other people's drafts.

## 2. Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com), create a project and go to
   **APIs & Services → Credentials → Create credentials → OAuth client ID** (type: Web application).
2. Under **Authorised redirect URIs** add the callback Supabase gives you, which looks like:
   `https://<your-project>.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client secret**.
4. In Supabase go to **Authentication → Providers → Google**, enable it, and paste both values.
5. In **Authentication → URL Configuration**, set the Site URL and add your redirect URLs
   (`http://localhost:3000/auth/callback` for local work, plus the production one).

## 3. Vercel

Add the same three variables from `.env.example` to the project's environment variables,
with `NEXT_PUBLIC_SITE_URL` pointing at the production domain.

## Product limits

Enforced both in the interface and on the server:

| Limit | Value |
| --- | --- |
| Images per project | 4 |
| Image upload size | 10MB, converted to WebP and resized on upload |
| Background video size | 10MB |
