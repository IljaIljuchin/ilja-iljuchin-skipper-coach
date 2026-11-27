# CLAUDE.md

## Project Overview
Personal website of Ilja Iljuchin ("Skipper & Coach"). What is offered and how it is described lives in the HTML pages themselves; treat the pages, not this file, as the source of truth for content.
- **Branches & Deployment:** All active development happens on the `dev` branch; `main` currently holds only a provisional placeholder page. Hosted on Vercel (`vercel.json`); every push to `dev` creates a preview deployment.
- **Stack:** Plain HTML + one stylesheet (`theme.css`) + one small script (`site.js`). No build step, no frameworks.

## Key Files
- `index.html` — Home: introduces both sides (coaching and skippering) and links to them.
- `coach.html` — Coaching page.
- `skipper.html` — Offshore skippering page.
- `runs.html` — Voyages, workshops and expeditions: planned, underway (hidden section until needed), and logbook.
- `about.html` — Background, story, and credentials.
- `theme.css` — Design tokens (`:root` colors) and all layout/component classes.
- `site.js` — Footer: copyright year and "Last updated" date in the visitor's locale.
- `.githooks/pre-commit` — Stamps `<time class="last-updated">` in every committed HTML page. Enable per clone with `git config core.hooksPath .githooks`.
- `assets/` — Images (`portrait.jpg`, `sunset.jpg`, `og-image.jpg`) and `contact.svg` (QR code pointing to `https://www.iljuchin.com/contact.vcf`).
- `contact.vcf` — Downloadable contact card (vCard 3.0).
- `vercel.json` — `cleanUrls` (pages are served as `/coach`, `/skipper`, …; `.html` URLs redirect) and response headers.
- `sitemap.xml` & `robots.txt` — Search indexing metadata. `runs.html` is `noindex` and left out of the sitemap until it has real content.

**URLs & links:** internal links, canonical, `og:url`, and sitemap use clean paths without `.html` (`/coach`, `https://www.iljuchin.com/coach`). Because of that, preview locally through a server (e.g. `npx serve .`), not by opening files directly. "Book a call" links go to `https://cal.com/ilja-iljuchin/quick-chat-30-min`.

## Page Structure
Every page follows the same skeleton; keep it identical across pages.
1. `<head>`: title, description, canonical, Open Graph/Twitter tags, favicons, `theme.css`.
2. Hero (`.hero`): primary navigation (`.site-nav`, same links on every page, `aria-current` on the active one), `h1` with `.role`, `.tagline`, and exactly one `.cta`.
3. Content sections (`.subpage-section`, cards in `.detail-grid`).
4. Bottom section (`.page-bridge` > `.bridge-cols`): main call to action on the left (2/3), the shared "Prefer to reach me directly?" QR card (`.bridge-side`) on the right (1/3).
5. Footer: copyright on the left, "Last updated" date on the right; then `site.js` and the Cloudflare analytics script.

Main call to action per page:
- `index.html`, `coach.html`, `skipper.html`: "Book a call" (cal.com). Secondary options (CV request, link to the other service) go in `.bridge-alt` under the button. No social links here.
- `about.html`, `runs.html`: follow on social media (`.social-btn`; LinkedIn is primary on About, Facebook on Runs). The hero button scrolls to `#follow`.

## Working Rules for Claude Code
1. **Language:** All site copy, filenames, identifiers, and code comments are in English. A Czech version will be added later.
2. **Plan before editing:** For multi-file changes, layout shifts, or copy rewrites, propose a concise plan first and wait for confirmation unless explicitly asked to apply immediately.
3. **Preserve design & structure:** Reuse existing classes and the color tokens in `theme.css`; no inline styles and no heavy dependencies. Keep layouts on simple fractions (1/2, 1/3 + 2/3, 1/4 …).
4. **Tone & copywriting:** Clear, direct, human, and conversational. Avoid stiff corporate buzzwords and unexplained jargon or acronyms.
5. **Keep navigation & SEO in sync:** When adding or renaming pages, sections, or key links, update the navigation on every page and `sitemap.xml`.
6. **Respect assets & external links:** Do not delete or rename files in `assets/` or break contact/booking/social links without checking references across all HTML files.
7. **Git hygiene (`dev` first):** Work on `dev`; do not touch `main` unless explicitly instructed. Summarize all modified files and key changes at the end of a task so `git diff` is easy to review.
