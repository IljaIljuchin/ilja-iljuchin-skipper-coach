# CLAUDE.md

## Project Overview
Personal website of Ilja Iljuchin ("Skipper & Coach"). What is offered and how it is described lives in the HTML pages themselves; treat the pages, not this file, as the source of truth for content.
- **Branches & Deployment:** All active development happens on the `dev` branch; `main` currently holds only a provisional placeholder page. Hosted on Vercel (`vercel.json`); every push to `dev` creates a preview deployment.
- **Maintenance mode:** branch `maintenance` holds a standalone page served with HTTP 503 for every URL (see its `README.md`). Switch it on by promoting its Vercel deployment to production; switch it off by promoting the latest `main` deployment. Never merge `maintenance` into `dev` or `main`.
- **Stack:** Plain HTML + one stylesheet (`assets/css/theme.css`) + one small script (`assets/js/site.js`). No build step, no frameworks.

## Key Files
- `index.html` — Home: introduces both sides (coaching and skippering) and links to them.
- `coach.html` — Coaching page.
- `skipper.html` — Offshore skippering page.
- `runs.html` — Voyages, workshops and expeditions: planned, underway (hidden section until needed), and logbook.
- `about.html` — Background, story, and credentials.
- `assets/css/theme.css` — Design tokens (`:root` colors) and all layout/component classes.
- `assets/js/site.js` — Marks preview hosts (`.is-preview`), footer copyright year, and "Last updated" date in the page's locale.
- `.githooks/pre-commit` — Stamps `<time class="last-updated">` in every committed HTML page and updates that page's `<lastmod>` in `sitemap.xml`. Enable per clone with `git config core.hooksPath .githooks`.
- `404.html` — Not-found page (dark theme).
- `assets/img/` — Images: `portrait.jpg` (sailing portrait), `headshot.jpg` (business portrait, also in JSON-LD), `sunset.jpg`, `og-image.jpg` (default share image), `og-coach.jpg` (Coach share image), `contact.svg` (QR code pointing to `https://www.iljuchin.com/contact.vcf`).
- `assets/docs/` — Downloadable documents (`risk-policy.pdf`, currently a draft served with `noindex`).
- Root-level files that must stay where they are: `contact.vcf` (its URL is encoded in printed QR codes), `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, `vercel.json`.
- `vercel.json` — `cleanUrls` (pages are served as `/coach`, `/skipper`, …; `.html` URLs redirect) and response headers.
- `sitemap.xml` & `robots.txt` — Search indexing metadata. `runs.html` is `noindex` and left out of the sitemap until it has real content.

**URLs & links:** internal links, canonical, `og:url`, and sitemap use clean paths without `.html` (`/coach`, `https://www.iljuchin.com/coach`). Because of that, preview locally through a server (e.g. `npx serve .`), not by opening files directly. "Book a call" links go to `https://cal.com/ilja-iljuchin/quick-chat-30-min`.

## Page Structure
Every page follows the same skeleton; keep it identical across pages.
1. `<head>`: title `Ilja Iljuchin — <Page>` (same text in `og:title` and `twitter:title`), description, canonical, Open Graph/Twitter tags, favicons, `theme.css`.
2. Hero (`.hero`): primary navigation (`.site-nav`, same links on every page, `aria-current` on the active one), `h1` with `.role`, `.tagline`, and exactly one `.cta`.
3. Content sections (`.subpage-section`). Items in `.detail-grid` are flat `.detail-card`s with a thin domain line; How sections use numbered `.steps`.
4. Bottom section (`.page-bridge` > `.bridge-cols`): main call to action on the left (2/3), the shared "Prefer to reach me directly?" QR card (`.bridge-side`) on the right (1/3).
5. Footer: copyright with business name and IČO (`Ing. Ilja Iljuchin · Skipper & Coach · IČO 88162541`) on the left, "Last updated" date on the right; then `site.js` and the Cloudflare analytics script.

Main call to action per page:
- `index.html`, `coach.html`, `skipper.html`: "Book a call" (cal.com). Secondary options (CV request, link to the other service) go in `.bridge-alt` under the button. No social links here.
- `about.html`, `runs.html`: follow on social media (`.social-btn`; LinkedIn is primary on About, Facebook on Runs). The hero button scrolls to `#follow`.

Visual restraint: boxes (background + border) are reserved for highlights only — the two worlds on Home (`.experience`) and the bottom call-to-action section (`.page-bridge`). Everything else uses thin domain-colored lines. Do not introduce new card styles.

Domain colors (used on cards, credentials, FAQ, Runs entries):
- Blue (default or `.sea`): at sea — skippering, voyages, workshops on the water.
- Pink (`.coaching` or `.shore`): on shore — coaching, workshops and training on land.

FAQ (`coach.html`, `skipper.html` only): `.faq` section with `.faq-intro` (heading only, 1/3) and `.faq-list` (2/3). Each page also carries a `FAQPage` JSON-LD block in `<head>`; whenever a question or answer changes, update both.

Structured data (JSON-LD): `index.html` holds the full `Person` (`@id` `https://www.iljuchin.com/#person`, credentials, languages, profiles), `WebSite`, and `ProfessionalService` (OSVČ, IČO 88162541, Prague). Other pages reference the person by `@id` and add `Service`, `FAQPage`, `AboutPage`, and `BreadcrumbList`. Keep credentials in sync with the About page.

Runs is work in progress: its nav link has `data-preview-only` (hidden unless `site.js` detects a non-production host) and `vercel.json` redirects `/runs` to `/` on `www.iljuchin.com`. To publish Runs, remove both, drop its `noindex`, and add it to `sitemap.xml`.

Security: `vercel.json` sets a Content-Security-Policy. No inline scripts (JSON-LD data blocks are fine) and no inline styles; new external hosts must be added to the policy.

`404.html` uses the dark theme (`body.theme-dark`) and absolute paths (`/assets/css/theme.css`, `/coach`), because Vercel serves it for any missing URL.

## Czech Version (planned)
Czech is the only other language that will be added.
- **URLs:** English stays at the root; Czech pages mirror it under `/cs/` with the same slugs (`/cs/`, `/cs/coach`, `/cs/skipper`, `/cs/about`, `/cs/runs`). Files: `cs/index.html`, `cs/coach.html`, …
- **Markup:** Czech pages use `<html lang="cs">` and `og:locale` `cs_CZ`. `site.js` already formats dates by the page language.
- **When the first Czech page goes live:** add `<link rel="alternate" hreflang="en|cs|x-default">` to both language versions, add `og:locale:alternate`, add a language switch to `.site-nav`, and list both versions in `sitemap.xml` with `xhtml:link` alternates. Do not add hreflang links before the Czech page exists.
- All pages reference assets with absolute paths (`/assets/...`), so Czech pages under `/cs/` can share them unchanged.

## Working Rules for Claude Code
1. **Language:** All site copy, filenames, identifiers, and code comments are in English. A Czech version will be added later.
2. **Plan before editing:** For multi-file changes, layout shifts, or copy rewrites, propose a concise plan first and wait for confirmation unless explicitly asked to apply immediately.
3. **Preserve design & structure:** Reuse existing classes and the color tokens in `assets/css/theme.css`; no inline styles and no heavy dependencies. Keep layouts on simple fractions (1/2, 1/3 + 2/3, 1/4 …).
4. **Tone & copywriting:** Clear, direct, human, and conversational. Avoid stiff corporate buzzwords and unexplained jargon or acronyms.
5. **Keep navigation & SEO in sync:** When adding or renaming pages, sections, or key links, update the navigation on every page and `sitemap.xml`.
6. **Respect assets & external links:** Do not delete or rename files in `assets/` or break contact/booking/social links without checking references across all HTML files.
7. **Git hygiene (`dev` first):** Work on `dev`; do not touch `main` unless explicitly instructed. Summarize all modified files and key changes at the end of a task so `git diff` is easy to review.
