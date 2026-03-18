# Orvalta Astro Frontend

Minimal Astro app that reads published blog posts from the WordPress REST API and is ready to deploy as a separate read-only frontend.

## File structure

- `package.json`: Astro dependency and local scripts
- `astro.config.mjs`: minimal Astro configuration
- `src/lib/wordpress.js`: small helper for reading posts from WordPress
- `src/layouts/BaseLayout.astro`: shared page shell
- `src/styles/global.css`: minimal styling
- `src/pages/index.astro`: simple landing page
- `src/pages/blog/index.astro`: blog index route
- `src/pages/blog/[slug].astro`: individual post route by slug

## How it works

- The app reads from WordPress only
- It does not modify WordPress
- The blog index fetches published posts
- The single post page resolves routes from post slugs
- WordPress rendered HTML is output with Astro `set:html`
- The WordPress API base URL is configurable with `WORDPRESS_API_BASE_URL`

## Environment variable

Create an `.env` file in `astro` if you want to override the default API base:

```env
WORDPRESS_API_BASE_URL=https://orvalta.com/wp-json/wp/v2
```

If this variable is not set, the app falls back to `https://orvalta.com/wp-json/wp/v2`.

## Run locally

1. Open a terminal in `astro`
2. Copy `.env.example` to `.env` if you want to set the API URL explicitly
3. Install dependencies:

```powershell
npm.cmd install
```

4. Start the local dev server:

```powershell
npm.cmd run dev
```

5. Open the local URL shown by Astro, usually:

```text
http://localhost:4321
```

6. Visit:

- `/` for the landing page
- `/blog/` for the post index
- `/blog/<slug>/` for a single post

## Build locally

To test a production build:

```powershell
npm.cmd run build
```

To preview the built site:

```powershell
npm.cmd run preview
```

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket
2. In Vercel, click `Add New...` then `Project`
3. Import the repository
4. Set the project `Root Directory` to `astro`
5. Confirm the detected framework is `Astro`
6. In Vercel project settings, add:

```text
WORDPRESS_API_BASE_URL=https://orvalta.com/wp-json/wp/v2
```

7. Deploy the project
8. After the first deploy, keep the provided `*.vercel.app` URL as the safe preview URL before attaching a public subdomain

## Connect `blog.orvalta.com` with Cloudflare DNS

1. In Vercel, open the Astro project and go to `Settings` then `Domains`
2. Add `blog.orvalta.com`
3. Vercel will show the exact DNS record it expects for that subdomain
4. In Cloudflare DNS for `orvalta.com`, create a `CNAME` record:
   - `Name`: `blog`
   - `Target`: the exact Vercel target shown in the Vercel domain settings
5. Wait for Vercel to verify the domain and issue SSL
6. Once verified, `blog.orvalta.com` will serve the Astro frontend while the main `orvalta.com` website stays untouched

## Automatic redeploys when WordPress content changes

The simplest automation-friendly option is a Vercel Deploy Hook.

1. In Vercel, open the Astro project
2. Go to `Settings` then `Git`
3. Create one Deploy Hook for the production branch
4. Copy the generated hook URL and treat it like a secret
5. Trigger that URL with an HTTP `POST` whenever WordPress content changes

Minimal ways to trigger it from WordPress later:

- Add a tiny custom WordPress hook in theme code or an mu-plugin that sends a `POST` request on post publish/update
- Or call the Deploy Hook manually during testing with:

```powershell
curl -X POST "YOUR_VERCEL_DEPLOY_HOOK_URL"
```

This keeps the frontend static, read-only, low-cost, and automatically rebuilt whenever content changes.
