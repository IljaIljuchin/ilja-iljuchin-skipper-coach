# Maintenance branch

This branch is not the website. It is a ready-made "maintenance mode" deployment
for www.iljuchin.com, used while the site is offline, being migrated, or not yet live.

## What it does
- Every URL returns `maintenance.html` with HTTP **503 Service Unavailable** and
  `Retry-After: 3600`. Search engines read this as "temporarily down, come back later"
  and keep the existing index instead of dropping or replacing pages.
- Only these files are served normally (HTTP 200): `contact.vcf`, favicons, `robots.txt`.
- `robots.txt` allows crawling, so crawlers actually see the 503.

## Turn maintenance on
1. Vercel dashboard -> project -> Deployments.
2. Filter by branch `maintenance`, open the latest deployment.
3. Click "Promote to Production". www.iljuchin.com now shows the maintenance page.

## Turn maintenance off
- Vercel dashboard -> Deployments -> latest `main` deployment -> "Promote to Production"
  (or "Instant Rollback" to the previous production deployment),
- or simply push to `main`; Vercel deploys it to production automatically.

## Notes
- Keep maintenance short (hours to a few days). After roughly a week of 503,
  search engines may start dropping pages.
- To change the page, edit `maintenance.html` on this branch and push; then promote again.
- Never merge this branch into `main` or `dev`.
