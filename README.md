# SMTCRE8 — Human Vision. AI Power. Real Innovation.

Independent, dependency-free static portfolio with Cloudflare Pages Functions and a D1-backed, Turnstile-protected enquiry flow. The source HTML prototype was used as a starting point; the public site is intentionally redesigned and content-verification-aware.

## Pages structure

- `/` — landing and founder positioning
- `/work/` — filterable curated directory
- `/work/<slug>/` — 15 authored case studies with evidence and status
- `/about/`, `/contact/`, `/privacy/` — information and secure enquiry flow
- `/api/config` — returns form readiness and public Turnstile site key
- `/api/enquiry` — validates, challenges, rate limits, saves enquiry
- `/api/admin/enquiries` — API-key protected private enquiry retrieval + 90-day data purge

No private source repository URL, env var, credentials, deployment secrets or private GitHub metadata is embedded in public HTML. Public repository images are served directly from verified public GitHub paths and are identified as repository assets / demo captures. Abstract graphics are explicitly illustrative, not official logos or screenshots.

## Deployment

**Cloudflare Pages Git integration (preferred)**: Create a separate GitHub repo (example `SMT-cmd/smtcre8-portfolio`), push this directory to its root, then Cloudflare > Workers & Pages > Create Pages > Connect to Git. Select that repo, main branch, no framework, build command blank, output directory `public`. Do not point Cloudflare at any product repo. Configure Pages Functions deployment via the `functions/` folder.

**Destination account selected by the owner:** `alongeoluwatimilehin1@gmail.com`. The D1 database `smtcre8-enquiries` (`fea08487-5e5d-4570-8211-3e7bc00cdda1`) and Turnstile widget `SMTCRE8 portfolio enquiries` (site key `0x4AAAAAAFgf3sPfMg6TJFOp`) have been created and verified there. GitHub repository creation is still required; the connected GitHub tool cannot create repositories. GitHub connection authorization must be checked in the authenticated Cloudflare UI. Do not start a Pages Direct Upload project if Git integration is desired; Cloudflare documents say a Direct Upload project cannot later switch to Git integration. A plain upload of just the HTML does not create the backend.

Provision a dedicated D1 database and bind it as `ENQUIRIES_DB` to both production and preview. Apply `migrations/0001_enquiries.sql` to D1 before opening the form. Create a Cloudflare Turnstile widget for the portfolio hostname(s). Add Pages environment variables / secrets:

| key | kind | notes |
|---|---|---|
| `TURNSTILE_SITE_KEY` | public setting | widget site key (not secret) |
| `TURNSTILE_SECRET` | secret | server-side verification secret |
| `IP_HASH_PEPPER` | secret | 32+ random bytes; for abuse hashes, never exposed |
| `ADMIN_API_KEY` | secret | 32+ random bytes; secure admin API reads |
| `ENQUIRIES_DB` | D1 binding | dedicated database |

Access the private enquiries endpoint only over HTTPS using an Authorization Bearer header. Never place the API key in public browser code. `DELETE /api/admin/enquiries` removes records older than 90 days; arrange a periodic manual review and purge, or extend this with a separate scheduled Worker, before handling personal data at scale. This build deliberately does not automatically email a notification because no verified receiving address/domain was specified. Consultations are *requests*, not calendar-confirmed bookings.

### Local checks

```bash
node --test tests/*.test.mjs
python3 -m http.server 8000 --directory public
```

The static server can be used for visual review, but does not run `/api/*`; those endpoints need Cloudflare's Pages dev runtime with D1 + Turnstile. Do not treat local static preview as a live, accepting enquiry service.

### Release gate

1. Confirm destination Cloudflare account and standalone GitHub repository; keep other repositories untouched.
2. Verify that public case-study evidence reflects current product state and content approval.
3. Configure D1, Turnstile + secret bindings and test form in staging with a consenting test address.
4. Check mobile 360px/390px, tablet 768px and desktop 1440px, menus, filters, deep-link pages, accessibility, external links, redirects, security response headers and privacy notice.
5. Verify Cloudflare Pages main commit deployment, visit several pages including a 404, submit a live staging enquiry and confirm private retrieval.
6. Set a custom domain, OG absolute URL / sitemap when known, and publish social handles only after checking availability.

See `PROJECT-VERIFICATION.md`, `BRAND-SYSTEM.md`, and `DEPLOYMENT-GATES.md`.

## Verified setup after 22 October 2026 continuation

- Owner selected Cloudflare account `alongeoluwatimilehin1@gmail.com`. Existing Pages projects `homefits` and `praylume-staging` left untouched.
- Dedicated D1 database provisioned and `migrations/0001_enquiries.sql` applied. The table and 2 indexes were queried successfully.
- Turnstile widget provisioned only for planned `smtcre8.pages.dev` host. Its secret is not in this repository; retrieve securely from the Cloudflare widget when binding Pages secrets. Ensure site hostname and Turnstile verifier hostname agree.
- The suggested Pages name is `smtcre8`; final domain only becomes valid after successful deployment. If unavailable, change the Turnstile hostname allowlist to the actual Pages URL.
- Tests include security failure cases and a simulated success path; no live enquiry has been sent. `npm test`; then on a live deployment `node scripts/qa-live.mjs https://smtcre8.pages.dev`.
- `.github/workflows/quality.yml` runs tests on push and PR. It does **not** deploy or alter any product repository. GitHub Actions results are not yet available.
