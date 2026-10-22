# Deployment / sign-off register

- [x] Read complete handoff and full HTML prototype.
- [x] Verify 17 GitHub repository visibility states and public metadata.
- [x] Create separate local codebase with 15 case-study pages.
- [x] Implement responsive UI, accessible navigation, filterable directory, and contact workflow code.
- [x] Integrate only verified public media paths; clearly label illustrative artwork.
- [x] New standalone GitHub repository `SMT-cmd/smtcre8-portfolio` exists and portfolio source is committed to `main`.
- [x] Destination Cloudflare account chosen by owner: alongeoluwatimilehin1@gmail.com (account ID 959b3bd7b4b4280b90b55e9d648a8986).
- [x] Cloudflare Pages `smtcre8` is Git-connected to that repository, deploying `main` from `public/`.
- [x] Dedicated D1 database `smtcre8-enquiries` created (ID fea08487-5e5d-4570-8211-3e7bc00cdda1); schema and indexes applied and verified.
- [x] Dedicated Turnstile widget created for proposed `smtcre8.pages.dev` hostname (public site key `0x4AAAAAAFgf3sPfMg6TJFOp`). Secret remains in Cloudflare.
- [x] D1, TURNSTILE_SITE_KEY, IP_HASH_PEPPER and ADMIN_API_KEY are bound to production and preview.\n- [ ] TURNSTILE_SECRET must be set as encrypted Pages environment secret in production and preview by an authorized operator. Do not expose it in Git, chat, or docs.
- [ ] Live form, rate limits, private retrieval, and error cases exercised against staged Cloudflare deployment.
- [x] Inlined-browser visual/layout tests at 360px, 390px, 768px, 1440px: no horizontal overflow, responsive menu works, project search matched MY-RP; environment blocked HTTP navigation so not a production screenshot or full network asset test.
- [ ] Full live mobile/desktop asset screenshot-based check and automated accessibility audit.
- [x] Cloudflare Git-triggered production deployment `cf8e9faa` completed successfully and `smtcre8.pages.dev` home/work content rendered through Cloudflare browser rendering; Pages Functions compiled.\n- [ ] Full public HTTP status/asset/404 and custom domain/social profiles independently verified.
- [ ] Once deployed run `node scripts/qa-live.mjs https://smtcre8.pages.dev` and repeat submission/Turnstile/DB persistence checks manually.

Never check uncompleted boxes merely because this source code exists.
\n## Verified hosted checkpoint · 2026-10-22\n- GitHub Actions quality run 39758503470: success.\n- Cloudflare Pages deployment a65b059b-dac0-4958-97bd-2619d634e54d: success, 29 assets uploaded, Functions compiled.\n- Browser Rendering could access homepage and work directory, then hit its per-minute rate limit for additional routes. This does not establish exhaustive live QA.\n- Form stays disabled until TURNSTILE_SECRET is securely provided in both Cloudflare Pages environments and a consenting end-to-end staging enquiry is tested.\n