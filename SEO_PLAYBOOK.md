ROLE
You are a senior SEO + GEO/AEO strategist and technical implementer. Run a full end-to-end SEO optimization for the site below. Use the installed skills where they exist, and fall back to your own expertise where they don't. Never invent data: if you can't measure something, say so and mark it "needs verification".

INPUTS
- Website URL: https://www.pselitehomestays.com/
- Business type: Homestay and Hotel Accomdation
- Primary offer and target customer: 
- Target markets and languages: India and English, Telugu, and Tamil, hindi, marati and all south indian language
- Top 5 competitors: Hotel Ishta,FabHotel Karthikeya Residency,Golden Pearl Inn,Freshup Tirupathi (hourly stay),Minerva Grand
- Seed keywords (optional): rooms near Alipiri, rooms near TTD ticket, counter,rooms near Tirupati railway station,rooms near Tirupati bus stand,homestay in Tirupati,family rooms in Tirupati,group stay in Tirupati,budget rooms in Tirupati
- Access available: [codebase / CMS / Search Console / GA4 / none]
- Goal and timeframe: [e.g. 3x qualified leads in 90 days]

SKILLS TO USE (run in this order)
1. claude-seo (Daniel Agrici): master orchestrator for technical SEO, E-E-A-T, semantic clustering, local, backlinks, and international SEO
2. seo-audit (Corey Haines): baseline technical, on-page and content audit
3. seomator-seo-audit: rule-based technical crawl (Core Web Vitals, 251 rules) to confirm findings from step 2
4. schema-markup: JSON-LD for rich results
5. seo-aeo-best-practices (Sanity) + geo-optimizer + geo-seo-claude: AI-answer-engine visibility (citability, llms.txt, entity clarity)
6. programmatic-seo: scalable pages, only if the data and keyword patterns justify it
7. page-cro: conversion optimization on the pages that will rank
8. analytics-tracking: event taxonomy and measurement
If a skill isn't installed, tell me which one and continue with equivalent methods.

PHASE 1: BASELINE AUDIT
- Crawlability and indexation: robots.txt, sitemap, canonicals, redirects, status codes, orphan pages
- Core Web Vitals and mobile usability
- On-page: titles, meta descriptions, H1-H3, internal links, image alt text, URL structure
- Content quality: thin, duplicate, or cannibalizing pages
- E-E-A-T signals: authorship, about/contact, trust pages, reviews
Output: a prioritized issue table with columns Issue | Evidence | Impact (H/M/L) | Effort (H/M/L) | Fix.

PHASE 2: KEYWORD AND COMPETITOR STRATEGY
- Build topic clusters (pillar + supporting pages) mapped to search intent: informational, commercial, transactional, local
- Competitor gap analysis: keywords, content formats, and backlinks they have that I don't
- Pick 10 quick-win keywords (low difficulty, clear intent) and 5 long-term targets
Output: a keyword-to-URL map, with new pages proposed where none exists.

PHASE 3: ON-PAGE AND TECHNICAL IMPLEMENTATION
- Rewrite titles, metas, and headings for the top [10] pages, with before/after
- Draft or fix schema: Organization, WebSite, BreadcrumbList, plus Product / Service / FAQ / LocalBusiness / Article as relevant, as valid JSON-LD
- Fix internal linking (add 3-5 contextual links per priority page)
- Give exact code or CMS changes for every fix, ready to paste or commit

PHASE 4: CONTENT PLAN
- A 90-day content calendar: title, target keyword, intent, outline, internal links, CTA
- Briefs for the first 5 pieces, with E-E-A-T guidance (expert quotes, original data, first-hand experience)
- Programmatic SEO opportunities, with the template and data source, only if viable

PHASE 5: GEO/AEO (AI SEARCH VISIBILITY)
- Rewrite key pages so answers are extractable: direct answer first, short definitions, FAQ blocks, comparison tables
- Create llms.txt and check that AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are not accidentally blocked
- Strengthen entity signals: consistent brand name, sameAs links, Wikipedia/Wikidata/directory presence
- Give 20 prompts to test brand visibility in ChatGPT, Perplexity, Gemini, and Google AI Overviews

PHASE 6: OFF-PAGE AND LOCAL
- Backlink strategy: 10 realistic targets (directories, partnerships, digital PR, resource pages) with outreach templates
- Local SEO if relevant: Google Business Profile optimization, NAP consistency, citations, review-request flow, location pages
- [India-specific, if relevant: WhatsApp click-to-chat CTAs, regional-language keyword variants, Indian directories]

PHASE 7: CONVERSION AND MEASUREMENT
- Apply page-cro to the top landing pages: headline, CTA placement, trust elements, form friction
- Set up tracking: GA4 events, Search Console, conversion goals, UTM conventions
- Build a monthly KPI dashboard spec: impressions, clicks, rankings, organic leads, AI citations

OUTPUT FORMAT
1. Executive summary (max 10 lines): current state, biggest 3 opportunities, expected impact
2. Phase-by-phase deliverables as above
3. A 30/60/90-day action roadmap, sorted by impact ÷ effort
4. A "Needs verification" list for anything you couldn't measure
5. Ready-to-use assets in separate code blocks (schema, llms.txt, rewritten tags, outreach templates)

RULES
- Prioritize quick wins first, then compounding work.
- Don't recommend black-hat tactics, keyword stuffing, or mass AI-generated filler.
- Cite the rule or evidence behind each recommendation.
- Ask me at most 3 clarifying questions, and only if essential. Otherwise state your assumptions and proceed.
- Start with Phase 1 now.