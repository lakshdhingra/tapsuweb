# TASPU PLATFORM — BUILD PROMPT

Build a production-ready website and admin system for **TASPU — Telangana Authorized Service Centre Proprietors Union**, a professional association representing authorized service centre proprietors in Telangana.

---

## 0. HOW TO WORK

Follow this operating procedure. Do not skip it.

1. **Plan first.** Before writing code, output: route map, database schema, RLS policy design, auth flow, component inventory, folder structure. Wait for nothing — then proceed.
2. **Build in the phase order in §13.** Finish and verify each phase before starting the next.
3. **After every phase, run and fix:** `pnpm tsc --noEmit`, `pnpm lint`, `pnpm build`. A phase is not done until all three pass clean.
4. **No placeholder code.** No `// TODO: implement`, no stubbed handlers, no fake `setTimeout` API calls. Every form submits to a real endpoint, every table reads from real Supabase queries.
5. **No mockups.** This is a working application, not a visual prototype.
6. **Ask nothing you can decide.** Where the spec leaves a choice open, pick the simpler, more maintainable option and note it in the README.
7. Keep a running `IMPLEMENTATION_NOTES.md` of decisions, deviations, and anything left for the client to supply.

---

## 1. WHAT YOU ARE BUILDING

Two clearly separated surfaces inside one Next.js app:

- **Public website** — for visitors, prospective members, stakeholders.
- **Admin dashboard** — protected, for TASPU administrators only. Different visual personality, different layout, different UX.

The system is **completely independent**. Do not connect to, import from, or assume the existence of any TASPU mobile app, existing backend, existing database, or external API. New Supabase project, new schema, new auth.

### The central feature

```
Visitor → Application form → PENDING in DB → Admin reviews → APPROVE or REJECT
                                                    │
                                          APPROVE → Member record created
                                                    + Membership ID generated
```

An application **never** auto-creates a member. The admin decides. Applications and members are two separate tables and two separate concepts — never conflate them.

---

## 2. HARD CONSTRAINTS

**Never build:**
- Member login, member auth, member dashboard, member profile, member settings, member portal, member sessions. Approved members do not log in. Only admins authenticate.
- Events, upcoming events, event registration, event tables, event admin.
- Service centre directory, finder, search, map, or detail pages.
- Any mobile-app integration or shared auth.

**Never do:**
- Invent TASPU facts — no real names, phone numbers, addresses, member counts, founding dates, achievements, or government relationships. Use `00+` for stats and `Name to be added` for leadership.
- Expose membership applications, uploaded documents, admin notes, or rejection reasons publicly.
- Hardcode dashboard numbers — every stat comes from a live query.
- Trust client-side authorization. Enforce in RLS and server code.
- Commit secrets. `SUPABASE_SERVICE_ROLE_KEY` is server-only, never in a client component or `NEXT_PUBLIC_` var.

**Always:**
- TypeScript strict mode, no `any`.
- Zod schema shared between client and server validation — validate on both sides, always again on the server.
- Row Level Security enabled on every table, default-deny.
- Confirmation dialogs before destructive or irreversible actions.
- Loading / empty / error / success states on every dynamic view.

---

## 3. STACK

- Next.js (latest stable), App Router, React Server Components by default
- TypeScript (strict), Tailwind CSS, shadcn/ui + Radix, Lucide React
- Framer Motion (subtle use only)
- React Hook Form + Zod
- Supabase: Postgres, Auth, Storage, RLS
- Recharts for the two or three admin charts that earn their place
- Resend-ready email layer: a `lib/email/` module with typed send functions that no-ops gracefully when `RESEND_API_KEY` is absent. Email must never block a database write.
- Deploy target: Vercel + Supabase

No separate Node/Nest backend. Use Next.js server actions and route handlers.

---

## 4. FOLDER STRUCTURE

```
app/
  (public)/          page.tsx, about/, about/mission-vision/, about/history/,
                     about/objectives/, leadership/, members/, members/benefits/,
                     news/, news/[slug]/, announcements/, announcements/[slug]/,
                     resources/, resources/[slug]/, media/, media/photos/,
                     media/videos/, contact/
  membership/apply/
  admin/             login/, dashboard/, applications/, applications/[id]/,
                     members/, members/[id]/, news/, news/create/, news/[id]/edit/,
                     announcements/ (+create, [id]/edit), resources/ (+create, [id]/edit),
                     media/, media/albums/, leadership/, messages/, users/, settings/
  api/
components/          ui/, layout/, public/, membership/, admin/
lib/                 supabase/, auth/, services/, validations/, email/, utils/
types/
supabase/            migrations/, seed.sql
```

---

## 5. DATABASE

Tables: `admins`, `membership_applications`, `members`, `leadership`, `news_articles`, `announcements`, `resources`, `media_albums`, `media_items`, `contact_messages`, `site_settings`, `audit_logs`.

**`membership_applications`** — `id`, `application_number` (unique, `TASPU-APP-00001` format), `full_name`, `email`, `phone`, `business_name`, `designation`, `years_experience`, `professional_category`, `district`, `city`, `address`, `reason_for_joining`, `additional_info`, `status` (`PENDING | UNDER_REVIEW | APPROVED | REJECTED`), `rejection_reason`, `admin_notes`, `submitted_at`, `reviewed_at`, `reviewed_by`, timestamps.

**`members`** — `id`, `membership_id` (unique, `TASPU-2026-00001`), `application_id` (FK, unique — this uniqueness is what prevents duplicate members), `full_name`, `business_name`, `district`, `city`, `phone`, `email`, `category`, `membership_date`, `status` (`ACTIVE | SUSPENDED | INACTIVE`), `public_visibility` (bool, default false), timestamps.

**`audit_logs`** — `admin_id`, `action`, `entity_type`, `entity_id`, `metadata` (jsonb), `created_at`. Write a row for every approve, reject, edit, delete, upload, and settings change.

`news_articles`: title, slug, category, author, content, cover_image, published_at, seo_title, seo_description, status (`DRAFT | PUBLISHED | ARCHIVED`).
`announcements`: same shape plus `priority` (`NORMAL | IMPORTANT | URGENT`).
`resources`: title, slug, category, description, file_path, file_type, file_size, year, visibility (`PUBLIC | ADMIN_ONLY`).

### ID generation
Both `application_number` and `membership_id` come from **Postgres sequences inside the transaction**, formatted by a DB function. Never generate them in application code. Never use random values. Format prefix and year source come from `site_settings` so they are configurable.

### Approval must be transactional
Implement approval as a single Postgres function (`approve_membership_application(app_id, admin_id)`) called via RPC that, in one transaction:
1. Locks the application row (`SELECT ... FOR UPDATE`) and asserts status is not already `APPROVED`
2. Sets status `APPROVED`, `reviewed_at`, `reviewed_by`
3. Inserts the member row with a sequence-generated `membership_id`
4. Writes the audit log

Any failure rolls the whole thing back. Double-clicking Approve must never produce two members.

### Duplicate application protection
Reject a new application if an existing non-rejected application shares the same email or phone. Enforce with a partial unique index plus a friendly pre-submit check. Similar names alone are not duplicates. Admins can override.

### RLS
Default deny on everything. Then:
- Public anon read: `news_articles` where `status='PUBLISHED'`, `announcements` published, `resources` where `visibility='PUBLIC'`, `leadership`, `media_*` where published, `site_settings` (public keys only), `members` where `public_visibility=true` **and only the columns TASPU chooses to publish** — expose this through a dedicated view, not the base table.
- Public anon insert only: `membership_applications`, `contact_messages`. No select, no update.
- Admin read/write gated on a `is_admin()` / `is_super_admin()` SQL helper that checks the `admins` table by `auth.uid()`.

---

## 6. STORAGE

Buckets: `public-media` (public read), `resources` (mixed — signed URLs for admin-only docs), `application-documents` (**private, admin-only, always signed URLs, never public**).

Validate on upload: MIME type, extension, size cap, sanitized filename. Allow PDF/JPG/PNG only for applications. No executables, ever. Validate server-side, not just in the browser.

---

## 7. AUTH

Supabase Auth, email + password, admin only. Roles `ADMIN` and `SUPER_ADMIN` stored in the `admins` table.

- `ADMIN`: applications, members, content, media, messages.
- `SUPER_ADMIN`: all of the above plus admin users, settings, permissions.

No public admin registration. Super admins create admins from `/admin/users`, or via a documented seed script. Middleware protects every `/admin/*` route except `/admin/login`, and RLS enforces the same rules at the database level. `/admin/login` is not linked from the public navbar.

---

## 8. DESIGN SYSTEM

Define these as Tailwind theme tokens and CSS variables — no raw hex in components.

```
burgundy-deep  #6B1724     primary-maroon #8B1E2D    burgundy-dark  #4E101A
gold-muted     #C9A227     gold-warm      #D4AF37
ivory          #FAF8F3     white          #FFFFFF
charcoal       #171717     gray-dark      #303030
gray-medium    #6B6B6B     gray-light     #E9E6E0
```

**Color ratio: 60% ivory/white, 20% charcoal, 15% burgundy, 5% gold.** Gold is an accent only — thin rules, active states, key numerals, icon strokes. Never a gold-filled screen. Not every section is red.

**Type:** Playfair Display for display/headings, Inter for body/UI. Strong hierarchy: small tracked eyebrow → oversized serif heading → supporting line → comfortable body. Large type used strategically, not everywhere. Avoid heavy uppercase.

**Spacing:** 8px grid (8/16/24/32/48/64/80/96/120/160). Desktop sections 80–140px vertical, mobile 48–80px.

**Grid:** 12-column, max content width 1280–1440px. Asymmetric editorial compositions — not everything in centered 50/50 splits.

**Radius:** 8px small UI, 12–16px cards, 16–24px large image containers. No pill shapes everywhere.

**Shadows:** borders do most of the work. Shadows extremely subtle (`0 8px 30px rgba(...)` at low opacity), used sparingly.

**Motion:** 150–250ms for buttons/links/hover, 300–500ms for cards/dropdowns/nav, 600–1000ms for hero and section reveals. Natural easing, no bounce, no springs. Scroll reveal = opacity 0→1 plus translateY 20px→0, staggered in hierarchy order (eyebrow → heading → body → image). Do not animate every element. Full `prefers-reduced-motion` support: strip movement, keep essential feedback.

**Aesthetic target:** premium, institutional, editorial, warm, human. Avoid: generic SaaS landing page, government portal, NGO template, heavy gradients, neon, glassmorphism, animated blobs, six-identical-cards layouts.

**Components to build once and reuse:** Button, Container, SectionHeading, Badge, Card, StatCard, Navbar, Footer, Dialog, Input, Select, Textarea, SearchInput, Pagination, Tabs, Breadcrumbs, EmptyState, LoadingState, ErrorState, ArticleCard, AnnouncementCard, MemberCard, ResourceCard, LeadershipCard, GalleryCard, ApplicationStatusBadge.

---

## 9. PUBLIC WEBSITE

### Homepage section order
Navbar → Hero → Statistics → About → Mission & Vision → Why TASPU → Membership → Leadership → Latest News → Announcements → Resources → Media → Final CTA → Footer.

**Navbar:** logo left, nav center (About, Members, Leadership, News, Announcements, Resources, Media, Contact), `Become a Member` CTA right. Transparent over the hero, then on scroll: ivory background, subtle border, reduced height, 200–300ms transition. Mobile: full-height panel with a smooth slide/fade, nav links then a divider then `Become a Member`.

**Hero:** eyebrow `TELANGANA AUTHORIZED SERVICE CENTRE PROPRIETORS UNION`. Heading `Stronger Together.` Supporting: `Building a connected and empowered community of authorized service centre proprietors across Telangana.` CTAs: `Become a Member` (primary), `Discover TASPU` (secondary). Desktop: text ~45–50%, large human-centred image ~50–55%, thin gold line and a restrained Telangana map outline as decoration — photograph stays the focus. Mobile: recompose, image above or behind the heading, typography stays powerful. Entrance: eyebrow fade → heading line-by-line reveal → supporting text up → buttons → image clip/mask reveal, total 0.6–1.2s.

**Statistics:** four large numerals with small labels and thin gold dividers — not cards. Values `00+` until real numbers exist, editable from admin. Count-up animation on viewport entry, subtle, no bounce.

**About:** editorial, tall portrait image one side with subtle border, gold accent and small caption; large serif heading the other. CTA `Learn More`.

**Mission & Vision:** full-width deep burgundy, ivory text, gold accents, large serif type, gold rule drawing horizontally on scroll, mission then vision staggered. No cards.

**Why TASPU:** heading `Why TASPU?`, line `Because a stronger community creates a stronger voice.` Six areas — Representation, Networking, Advocacy, Knowledge, Support, Community — as a horizontal numbered sequence on desktop, vertical on mobile. **Not six identical cards.** Hover: title → burgundy, gold line expands, description reveals, icon nudges (200–400ms).

**Membership:** heading `Become part of something stronger.` Large community image with dark translucent overlay, `STRONGER TOGETHER.` and `Apply for Membership` → `/membership/apply`.

**Leadership:** rectangular portrait cards (not circles), role above `Name to be added`. Hover: slight image zoom, gold line, subtle lift.

**News:** one visually dominant featured article, secondary articles smaller alongside. Cards vary in size.

**Announcements:** clean list with priority label, title, date, dividers. Urgent/Important get stronger treatment. Not repeating cards.

**Resources:** minimal document-library rows with a trailing arrow. Hover: row shifts, arrow moves, gold line appears.

**Media:** masonry/editorial grid with varied sizes. Hover: subtle scale, dark overlay, caption, arrow. Click opens a smooth lightbox. Supports YouTube/Vimeo URLs for video.

**Final CTA:** burgundy or charcoal. `Stronger together. Stronger for Telangana.` CTAs `Apply for Membership` and `Contact TASPU`.

**Footer:** dark, institutional, gold accents, org name in full, link columns, Privacy/Terms, copyright.

### Other public pages
`/members` is **informational, not a login** — benefits, membership statistics, and publicly-flagged member info only. Never contact details or documents. `/contact` has office info, email, phone, address, social links, and a form (name, email, phone, subject, message) writing to `contact_messages`.

---

## 10. MEMBERSHIP APPLICATION

Five steps: `01 Personal → 02 Professional → 03 Location → 04 Documents → 05 Review`. Progress indicator with burgundy + gold for current, gold check for complete. Header: `Become a TASPU Member` / `Tell us about yourself and your professional background.`

Fields — personal: full name, email, phone. Professional: business/service centre name, designation, years of experience, professional category. Location: district, city, address. Additional: reason for joining, additional information. **Collect nothing sensitive that isn't genuinely needed** — no DOB or gender unless officially required.

Documents: premium drag-and-drop zone stating accepted types and size cap; after upload show filename, size, progress, remove button.

Inputs: white background, 1px neutral border, burgundy focus border with a subtle glow, large labels, generous spacing, no heavy shadows. Mobile: full-width fields, large touch targets, sticky back/next.

Review step shows a sectioned summary with `Back` and a visually prominent `Submit Application`.

Validation: required fields, real email and phone validation, file type/size checks, duplicate detection, clear inline errors, explicit loading/success/failure states.

Success screen (not a redirect to a generic page): checkmark with a subtle animation, `Application Received`, the reassurance copy, the reference number `TASPU-APP-00001`, and `Return to Home`. No account is created. No applicant login.

---

## 11. ADMIN DASHBOARD

Different personality from the public site: clean, efficient, data-focused. Mostly white/ivory/charcoal/light gray, burgundy for primary actions, gold only as a faint accent. Not a burgundy dashboard.

**Sidebar:** Dashboard / MEMBERSHIP (Applications, Members) / CONTENT (News, Announcements, Resources, Media) / ORGANIZATION (Leadership, Messages) / ADMINISTRATION (Users, Settings) / Logout. Mobile: top bar + drawer.

**Dashboard home:** live-query stat cards — Total Members, Pending Applications, This Month, Published News, plus approved/rejected counts, resources, unread messages. **Pending Applications is the visually prominent one.** Below: Recent Applications table (applicant, district, date, status, action). Analytics: applications this month/year, approval rate, members added this month. Charts only where they help.

**`/admin/applications`:** filter tabs (All / Pending / Under Review / Approved / Rejected), search by name, application number, phone, email; filters for district and date range. Columns: applicant, business, district, contact, date, status badge, actions. Export approved applications and application records to CSV (authorized, sensitive fields excluded). Bulk filtering yes; bulk deletion no.

**`/admin/applications/[id]`:** two-column desktop. Left: Applicant Information, Professional Information, Location, Documents (signed URLs), Application Information. Right: current status and actions — `Approve`, `Reject`, `Mark Under Review`, `Request More Information`, plus an admin notes field.

- Approve dialog: "You are about to approve this membership application. The applicant will be added to the TASPU member records." → calls the transactional RPC.
- Reject dialog: optional reason textarea. Sets status, date, reason. Rejected applications are retained, never auto-deleted.

**`/admin/members`:** search, status and district filters, columns Membership ID / Name / Business / District / Joined / Status / Actions. Admin can view, edit, suspend, deactivate, restore, toggle `public_visibility`, and delete — but prefer deactivate/archive, and require confirmation for anything destructive.

**Content admin (news, announcements, resources, media, leadership):** page header, create button, filters, search, table or grid, pagination, edit/delete. Editor: title, slug, category, rich text with toolbar and image upload, cover image, SEO title and description, status, `Save Draft` / `Publish`. Sanitize all rich text server-side before storing and before rendering.

**Interactions:** subtle row hover, icon buttons with tooltips, confirmation dialogs on destructive actions, unobtrusive toasts (`Application approved successfully.`, `News article published.`, `Changes saved.`). Tables become horizontally scrollable or stacked cards on mobile.

**`/admin/settings`:** homepage statistics, organization description, mission, vision, contact information, social links, membership ID format — all backed by `site_settings`.

---

## 12. CROSS-CUTTING QUALITY

**Responsive:** flawless at 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920. No horizontal scroll. Mobile layouts are recomposed, not shrunk.

**Accessibility:** semantic HTML, correct heading order, keyboard navigation throughout, visible focus states, labelled form controls, alt text, accessible dialogs, WCAG AA contrast, reduced-motion support.

**SEO:** per-page title, description, canonical, OpenGraph, Twitter metadata. `/sitemap.xml`, `/robots.txt`. Organization, Article, and BreadcrumbList structured data. No keyword stuffing.

**Performance:** `next/image` everywhere with responsive sizes, server components by default, lazy loading, dynamic imports for heavy client code, sensible caching and revalidation. Minimal client JS. Target strong Lighthouse scores.

**Security:** RLS as described, server-side authorization, input validation, file validation, rate limiting on the application and contact endpoints, secure headers, XSS protection, sanitized rich text, protected admin routes.

**Env:** create `.env.example` with `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`. No real values committed.

**Seed data:** Demo Administrator, a few sample members, news articles, announcements, resources, media items. Clearly fictional. Statistics `00+`. Leadership `Name to be added`. Logo is a clearly-marked typographic placeholder in a single component, trivially replaceable — not a fake government emblem.

---

## 13. BUILD PHASES

1. Project setup — Next.js, TypeScript strict, Tailwind theme tokens, fonts, shadcn/ui, lint/format config, folder scaffold
2. Design system — all reusable components in §8, rendered on an internal `/styleguide` route
3. Public shell — navbar, footer, page transitions, layout primitives
4. Homepage — every section in §9
5. Remaining public pages (static content first)
6. Supabase — migrations, schema, sequences, the approval function, RLS policies, storage buckets, seed
7. Membership application — multi-step form, validation, upload, submission, success screen
8. Admin auth — login, middleware, role helpers, session handling
9. Admin shell + dashboard home with live stats
10. Applications list + detail + approve/reject/under-review + audit logging
11. Member management
12. News, announcements, resources, media, leadership management
13. Messages + settings
14. Wire public pages to live Supabase data
15. Email layer (Resend-ready, non-blocking)
16. SEO, sitemap, robots, structured data
17. Performance and accessibility pass
18. Security review — attempt unauthorized admin access, verify RLS blocks anon reads of applications and members, verify application documents are unreachable without a signed URL, test invalid and oversized file uploads
19. Responsive QA at every breakpoint
20. README + deployment config

**README must cover:** overview, architecture, stack, folder structure, Supabase setup, database and migration steps, environment variables, auth and first-admin creation, storage setup, local development, the membership workflow, Vercel deployment, and troubleshooting.

---

## 14. DONE MEANS

- `tsc --noEmit`, `lint`, and `build` all pass clean
- A visitor can submit a real application that lands in Postgres as `PENDING` with a reference number
- An admin can log in, see it, approve it, and a member record with a unique `TASPU-2026-xxxxx` ID appears — once, even under double submission
- An anonymous client cannot read `membership_applications`, `members`, or any file in `application-documents`
- Every dashboard number comes from a query
- Nothing on the site states a fact about TASPU that wasn't supplied
- The homepage does not look like a template
