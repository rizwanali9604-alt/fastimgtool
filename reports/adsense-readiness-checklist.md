# AdSense Application Readiness Checklist

**Site:** https://fastimgtool.com  
**Spot-check:** Run `node scripts/spotcheck_live.js` → [spotcheck-latest.json](./spotcheck-latest.json)

---

## Pre-application spot-check

### Automated

- [x] Homepage returns 200
- [x] Policy pages (`/privacy.html`, `/terms.html`, `/about.html`, `/contact.html`) reachable
- [ ] `/guides/how-to-use-test-tool.html` returns **404** (deploy `_redirects` + `404.html` — currently may SPA-fallback to homepage)
- [ ] `/tools/test-tool/` returns **404** (same)
- [x] `robots.txt` blocks `/templates/`, `/scripts/`, `/config/`
- [x] Privacy mentions cookies, ads, and Google Analytics (GA4)
- [x] Terms updated with contact email (hello@fastimgtool.com)
- [x] Thin/clone guides noindexed; sitemap lists ~33 curated guides only
- [x] Tool pages use real AdSense units (not placeholders)
- [x] Brand consistency: FastImageTool in titles and policy pages

### Manual (5 minutes)

- [ ] Tools work on mobile (upload → process → download)
- [ ] No placeholder or lorem ipsum on live pages
- [ ] Footer: Privacy, Terms, About, Contact all work
- [ ] 10+ flagship guides live (800+ words, FAQ schema)

---

## Apply to AdSense

1. [Google AdSense](https://www.google.com/adsense/) → **Get started**
2. Site URL: `https://fastimgtool.com`
3. Publisher ID on site: `ca-pub-8332278513903196`
4. Wait 1–14 days after submit

### Record after you apply

| Field | Value |
|-------|-------|
| Application submitted | _YYYY-MM-DD_ |
| Approval date | _pending_ |
| Rejection reason (if any) | |
| First earnings date | |

---

## If rejected

1. **Thin content** — upgrade more guides in `/guides/`
2. **Policy** — privacy must mention cookies/ads
3. **Invalid traffic** — never click your own ads
4. Re-apply only after fixing cited issues; wait 1–2 weeks
