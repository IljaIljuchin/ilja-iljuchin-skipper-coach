# CLAUDE.md

## Project Overview
Personal portfolio and service website combining **Skipper & Coach** positioning (Offshore Skipper, Executive/Leadership & Agile Team Coach, plus career advisory / executive interview prep / go-to-market career strategy).
- **Branches & Deployment:** All active development and site changes happen on the `dev` branch; `main` currently holds only a provisional/temporary placeholder page. Hosted on Vercel (`vercel.json`).
- **Stack:** Plain HTML + CSS (`theme.css`), static assets (`assets/`, `contact.vcf`, `favicon.*`, `apple-touch-icon.png`), `robots.txt`, `sitemap.xml`.

## Key Files & Structure
- `index.html` — Main landing page ("Skipper & Coach").
- `skipper.html` — Offshore skippering / sailing page.
- `coach.html` — Coaching & career advisory page.
- `about.html` — About / background page.
- `runs.html` — Additional content/overview page (verify navigation links and purpose before editing).
- `theme.css` — Shared visual design system, typography, spacing, and layout rules.
- `assets/` — Visual and contact assets (`portrait.jpg`, `sunset.jpg`, `contact.svg`, etc.).
- `sitemap.xml` & `robots.txt` — Search indexing and routing metadata.

## Working Rules for Claude Code
1. **Language & localization:** We are currently tuning the website completely in English. All artifact names, filenames, identifiers, and code comments must be written strictly in English; machine translation of the site content into Czech will be handled later.
2. **Plan before editing:** For multi-file changes, layout shifts, or copy rewrites, propose a concise plan first and wait for confirmation unless explicitly asked to apply immediately.
3. **Preserve existing design & structure:** Reuse existing classes and design tokens in `theme.css` rather than inventing one-off inline styles or introducing heavy dependencies.
4. **Tone & Copywriting:** Keep copy clear, direct, human, and conversational. Avoid stiff corporate buzzwords or unexplained jargon/acronyms; match the language of the page being edited.
5. **Keep navigation & SEO in sync:** Whenever adding/renaming pages, sections, or key links, check header/footer navigation across HTML files and update `sitemap.xml` if needed.
6. **Respect assets & external links:** Do not delete or rename files in `assets/` or break contact/booking/social links without checking references across all HTML files.
7. **Git hygiene (`dev` first):** Make all changes on `dev` (do not touch or treat `main` as the active codebase unless explicitly instructed). Summarize all modified files and key changes clearly at the end of a task so `git diff` is easy to review.