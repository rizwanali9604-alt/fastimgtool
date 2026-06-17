# RPM Recalculation (after 30 days of AdSense)

**Calculator:** [rpm-calculator.html](./rpm-calculator.html)

## Pull actual RPM

1. AdSense → Reports → Overview → Last 30 days
2. RPM = (Earnings ÷ Page views) × 1,000

Example: $12.50 on 8,000 views → **$1.56 RPM**

## Update files

1. Enter values in `rpm-calculator.html`
2. Add to `growth-baseline-week0.json` under `adsense`:
   - `rpm_actual_30d`, `earnings_30d_usd`, `recalc_date`
3. Log in `growth-tracking-weekly.md`

## Pageviews needed (formula: `(target_usd / rpm) × 1000`)

| RPM | $50/mo | $200/mo | $500/mo |
|-----|--------|---------|---------|
| $1.00 | 50,000 | 200,000 | 500,000 |
| $2.00 | 25,000 | 100,000 | 250,000 |
| $3.00 | 16,667 | 66,667 | 166,667 |

## Schedule

| Milestone | Action |
|-----------|--------|
| AdSense approved | Log in `adsense-readiness-checklist.md` |
| Day 30 | First RPM recalc |
| Monthly | Update weekly tracker |
