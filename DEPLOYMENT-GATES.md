# Deployment / sign-off register

- [x] Read complete handoff and full HTML prototype.
- [x] Verify 17 GitHub repository visibility states and public metadata.
- [x] Create separate local codebase with 15 case-study pages.
- [x] Implement responsive UI, accessible navigation, filterable directory, and contact workflow code.
- [x] Integrate only verified public media paths; clearly label illustrative artwork.
- [ ] New *standalone* GitHub repository exists and has this source committed.
- [x] Destination Cloudflare account chosen by owner: alongeoluwatimilehin1@gmail.com (account ID 959b3bd7b4b4280b90b55e9d648a8986).
- [ ] Cloudflare Pages Git integration connected to the standalone repository.
- [x] Dedicated D1 database `smtcre8-enquiries` created (ID fea08487-5e5d-4570-8211-3e7bc00cdda1); schema and indexes applied and verified.
- [x] Dedicated Turnstile widget created for proposed `smtcre8.pages.dev` hostname (public site key `0x4AAAAAAFgf3sPfMg6TJFOp`). Secret remains in Cloudflare.
- [ ] Bind D1 and widget configuration plus secret environment variables to Git-integrated Pages production/preview environments once project exists.
- [ ] Live form, rate limits, private retrieval, and error cases exercised against staged Cloudflare deployment.
- [x] Inlined-browser visual/layout tests at 360px, 390px, 768px, 1440px: no horizontal overflow, responsive menu works, project search matched MY-RP; environment blocked HTTP navigation so not a production screenshot or full network asset test.
- [ ] Full live mobile/desktop asset screenshot-based check and automated accessibility audit.
- [ ] Pages production deployment and `https://smtcre8.pages.dev` domain verified; custom domain and social profiles independently confirmed live.
- [ ] Once deployed run `node scripts/qa-live.mjs https://smtcre8.pages.dev` and repeat submission/Turnstile/DB persistence checks manually.

Never check uncompleted boxes merely because this source code exists.
