**Site verdict:** Solid with gaps. The commercial pages and the new post hold up well in a core update because they rely on cases and data that only Nacho Mascort has. The risk is the SEO Hacks archive: 19 posts from 2015–2017, almost all commodity or outdated, which make up 44% of the Spanish URLs in the sitemap and 90% of the blog.

Method: I applied the Google Quality Audit skill (four pillars from 0 to 4, commodity test, red flags from the Search Quality Rater Guidelines of 11 Sept 2025 and signals from the May 2024 leak) to one page per page type. Source: HTML generated in `dist/` (5 Oct 2026, version not yet published), read directly and judging only the main content, without navigation or forms. For the tool I reviewed the code of `functions/api/bot-check.ts` and tested the production endpoint (`/api/bot-check`) with nytimes.com and nachomascort.com. I ran the top 10 tests with web searches in the US; where I only saw titles and snippets I say so ("partly checked"). I have no traffic or Search Console data, so the recommendations on the archive do not take into account which posts bring visits.

### Summary

| Page type | Page audited | Score | Commodity class | Verdict |
|---|---|---|---|---|
| Home | `/` | 11/16 | Non-commodity | Solid with gaps |
| Services | `/servicios/consultoria-seo-geo/` | 10/16 | Partly commodity | Solid with gaps |
| Case studies | `/casos/softonic-0-a-20-millones/` | 10/16 | Non-commodity | Solid with gaps |
| Tools | `/herramientas/comprobador-bots/` | 11/16 | Partly commodity | Solid with gaps |
| New blog (2026) | `/blog/quality-google-core-updates/` | 13/16 | Non-commodity | Strong |
| SEO Hacks archive (2015–2017) | `/blog/que-es-thin-content/` | 6/16 | Commodity | At risk |

---

### 1. Home

**Verdict:** Solid with gaps (11/16, non-commodity). The page sells with its own names and figures, but all the proof ends in claims with no external evidence and several phrases are repeated almost word for word.

**Purpose:** introduce Nacho Mascort as an SEO, GEO and AI consultant and lead to a call or the form. YMYL: no (B2B marketing services; it does not affect health or personal finance).

| Pillar | Score | Evidence | Fix |
|---|---|---|---|
| Effort | 3/4 | Tailor-made content: four services, each with a concrete figure ("pasó de 200 a más de 3.000 creatividades por semana", "contraté un equipo de 8 personas"), a teaching block with dates (UPF 2015–2024, Webpositer since 2018), a logo wall, a course with data (450+ students, 80+ videos). | Add a piece that is hard to replicate: a testimonial with the name and title of a client or of a former Softonic/Reverse Tech colleague, or a real screenshot of a traffic chart. |
| Originality | 3/4 | Everything it offers is its own: Softonic 0 → 20M sessions, word.tips x2 with peaks of 2M visits/day, Reverse Tech 0 → $2M margin, savings of "unos 20.000 € al mes". No competitor can copy this data. | It would reach 4 with something others cite: a figure published here for the first time (e.g., the percentage of generated pages that survived the core updates at Softonic). |
| Talent or skill | 3/4 | Clear structure (who I am, why me, services, case studies, teaching, course, blog, contact), visible CTAs, figures at the top. Drawbacks: "Ex ingenieros de Google Search me contrataron" appears in the meta description, in "Por qué yo", in the SEO service and again in the bio of every post; "Trabajas directamente conmigo, sin juniors ni subcontratas" appears twice. "Más de diez años enseñando" clashes with "lleva más de 8 años dando clase en másters" in the same scroll. The blog block shows only two posts (2026 and 2023), which exposes a three-year gap. | Say the Google claim once and well (in "Por qué yo"), unify the years of teaching (since 2015 that is 11) and, until there are more new posts, show only the 2026 one or a tools block on the home page. |
| Accuracy | 2/4 | Specific figures, consistent across home, services and case studies, but none has a verifiable source: the case studies it links to have no charts, screenshots or external references either. "Me han mencionado: Google Search Central" does not link to the mention. | Link each "Me han mencionado" logo to the specific piece and add one proof per main figure to the case studies (cropped Search Console or Analytics screenshot, link to a talk or to the company's LinkedIn). |

**Commodity**
- Swap test: if you change the name for another consultant's, the page loses the case studies, the logos, the teaching and the course. Passes.
- Top 10 test: does not apply to a personal brand home page (the query is navigational, "Nacho Mascort").
- Only-you assets used: case studies with figures, client and media logos, teaching, own course, own tools.
- Missing non-commodity angle: a quote from a named client with a result, or a real chart from one of the case studies in the "Resultados con nombre y cifra" block itself.

**Red flags:** none from the Lowest/Low lists. No ads or popups (`clutterScore` with no cause for concern). The "Company" field in the form is a hidden honeypot (`aria-hidden`), so it does not matter.

---

### 2. Services: SEO, AEO and GEO Consulting

**Verdict:** Solid with gaps (10/16, partly commodity). The social proof is unique, but the process, the deliverables and the FAQ are what any GEO consultant would publish.

**Purpose:** explain the SEO/GEO consulting service, filter the right client and lead to a call. YMYL: no.

| Pillar | Score | Evidence | Fix |
|---|---|---|---|
| Effort | 3/4 | Real fit and exclusion criteria ("Buscas SEO local para un único negocio. Ahí te irá mejor una agencia local"), own opinion on AI and SEO, the Softonic example (a catalog of 100,000 apps that covered a small part of demand), a "máximo de 4 clientes" limit, an honest warning about llms.txt. | Add an anonymized example of a deliverable (a page from a real audit, a row from the 90-day roadmap). |
| Originality | 2/4 | What is its own: the case studies and the point of view. The four phases (diagnosis, fixes, content, measurement), the five deliverables and the FAQ "¿Qué diferencia hay entre SEO, AEO y GEO?" match what other GEO consultants publish (e.g., Alejandro Rioja's article on what a GEO consultant does lists entity audit and structured data, citation baseline and a prioritized list). | Replace the generic SEO/AEO/GEO FAQ with something only Nacho can tell: how he measured citations in ChatGPT/Perplexity at Reverse Tech, what changed and with what result. |
| Talent or skill | 3/4 | Very well organized: who it is for, point of view, how we work with weeks, deliverables, results, formats, FAQ, next step in three steps. It quickly answers "is this for me?". Drawbacks: "No es otro servicio con un nombre de moda: es el mismo trabajo bien hecho" is exactly the slogan that gives away template text; "No tengo tarifas cerradas" and, further down, "propuesta con… precio cerrado" read as a contradiction even though they are not. | Rewrite that sentence in plain language ("Lo mido también fuera de Google") and clarify: "No tengo tarifa fija; cada propuesta lleva un precio cerrado". Giving a rough price range would filter better. |
| Accuracy | 2/4 | The definitions and the note on llms.txt are correct. The business claims ("Las búsquedas informativas sencillas se las quedan los AI Overviews y los asistentes") come with no data or source, and the case study figures depend on pages that do not prove them either. | Support the thesis with a figure (own or from a cited study) and strengthen the proof in the case studies (see section 3). |

**Commodity**
- Swap test: it loses Softonic, word.tips, Cliqpod/Reverse Tech and the 4-client limit. The rest (phases, deliverables, FAQ) would stay the same under another name.
- Top 10 test: partly checked. For "consultoría SEO GEO consultor freelance" the results are mostly Malt profiles and job listings, plus a generic article on what a GEO consultant does. None has case studies with figures, so the page stands out for its proof, not for its method.
- Only-you assets used: case studies with figures, experience with former Google teams, own opinion, client limit.
- Non-commodity angle: "Qué cambió cuando medimos las citas de Reverse Tech en ChatGPT y Perplexity durante X meses", with the before and after table, as the central block of the page.

**Red flags:** none. One template-style sentence (see Talent) that does not reach filler (5.2.2).

---

### 3. Case studies: Softonic, from 0 to 20 million sessions a month

**Verdict:** Solid with gaps (10/16, non-commodity). It is a story only Nacho can tell, including the failure, but it is short, has no charts and tells the "how" in headlines.

**Purpose:** show with a real case the ability to design a large-scale content program and lead to contact. YMYL: no.

| Pillar | Score | Evidence | Fix |
|---|---|---|---|
| Effort | 3/4 | Context with dates and roles (2019–2024, SEO Specialist → Product Owner → SEO Manager), the problem, five levers, a "Lo que salió mal" section with the drop of "un 20 y pico por ciento" after consolidating languages and the recovery after moving to ccTLDs. | Add the timeline with dates (when the consolidation, which core update, when the recovery) and a sessions chart, even without a Y axis. |
| Originality | 3/4 | First-hand experience nobody else can publish, with a non-obvious lesson (weak translations lowered the main domain's rating). | Share the figure that would make it citable: what percentage of the generated pages was indexed, how many were withdrawn and by what criterion. |
| Talent or skill | 2/4 | 722 words. The only image is the Softonic logo. "Cómo lo hicimos" stays at headline level: "entrenamos nuestros propios modelos de generación" or "cada lote pasaba por flujos de generación y revisión" do not say which models, what review or how many people. "Páginas útiles" is not defined. | Expand the "how" with an example page (before/after), the review flow in a diagram and the metric that decided whether a batch continued. |
| Accuracy | 2/4 | The figures are concrete (0 → 20M, 100k → 1M+, +40 % in 2024) but carry no proof or source; "un 20 y pico por ciento" is vague; the core update is not named. | One cropped screenshot per main figure, name the core update and give the exact percentage of the drop. |

**Commodity**
- Swap test: passes. Without Nacho the page does not exist.
- Top 10 test: does not apply (own case).
- Only-you assets used: Softonic experience, internal figures, the story of the languages.
- Pending non-commodity angle: it already is one; what is missing is evidence and process detail.

**Red flags:** none. One contextual caveat: the case describes AI-generated content at scale (100,000 → 1M+ pages). Told this briefly, a skeptical reader may read it as what section 4.6.5 calls scaled content. Explaining the quality control and the demand criterion in detail protects it. [Auditor judgment]

---

### 4. Tools: Bot access checker

**Verdict:** Solid with gaps (11/16, partly commodity). The tool works and the guide is precise, but almost identical checkers already exist.

**Purpose:** check whether Googlebot, Bingbot and AI bots can crawl a URL, and explain why they cannot. YMYL: no.

| Pillar | Score | Evidence | Fix |
|---|---|---|---|
| Effort | 3/4 | Own tool (a 488-line Cloudflare Pages Function): 15 bots with a real request plus 2 robots.txt-only tokens, robots.txt matching with the longest rule and wildcards, comparison with a browser, challenge detection (Cloudflare, Akamai, DataDome…), noindex in meta and X-Robots-Tag with bot prefix, sitemaps, "thin" response and SSRF protection. Tested in production: on nytimes.com it detects the DataDome 403 and the `Disallow: /` rules for each AI bot; on nachomascort.com, everything "ok" and the sitemap valid. | Store (with permission and anonymized) aggregate results to publish original data. |
| Originality | 2/4 | There are almost identical tools. 365i's (AI Crawler Checker) makes real requests with 14 bots, compares with the browser, checks noindex and warns about the IP verification limit; Lightsite makes requests with 8 bots and detects WAF; LLM Pulse only analyzes robots.txt. What is its own here: in Spanish, any URL (not just the home page), Google-style matching, sitemap and detection of trimmed responses. | Publish a study with the tool: "Qué bots de IA bloquean las 500 webs más visitadas de España", with the table. Nobody has that. |
| Talent or skill | 3/4 | Useful, well-written guide (four causes, search/user/training taxonomy, honest limits, FAQ with the exact Cloudflare dashboard path). The tool marks a fake Googlebot that is blocked as "warning" and not "blocked", which is the correct reading. | Link each "warning" result to the section of the guide that explains it. |
| Accuracy | 3/4 | The behavior on a 5xx robots.txt (12 hours, last copy for up to 30 days, then no restrictions if the site responds) matches Google's documentation and links to it. The bot taxonomy for OpenAI, Anthropic and Perplexity is correct, as is the Google-Extended point. One detail in the code: the group is chosen with `token.startsWith(agent)`, so a `User-agent: Claude` line would apply to ClaudeBot and to Claude-SearchBot, when RFC 9309 asks for an exact token match. [Auditor judgment] | Change to exact (case-insensitive) matching and, if you want to imitate Google's fallback for its own crawlers, treat it as a separate case. |

**Commodity**
- Swap test: with another brand, the Spanish-speaking user loses the guide in Spanish and some checks (sitemap, Google matching); the core they would find at 365i.
- Top 10 test: checked by opening three results for "comprobar si bots de IA GPTBot ClaudeBot pueden acceder" (LLM Pulse, Lightsite, 365i). The guide and the tool are a bit ahead in technical detail, but the function is the same.
- Only-you assets used: own tool, experience with Cloudflare and robots.txt.
- Non-commodity angle: the study of AI bot blocking on Spanish sites done with the tool itself, updated every quarter.

**Red flags:** none.

---

### 5. New blog (2026): Quality at Google

**Verdict:** Strong (13/16, non-commodity). A first-hand account of Search Central Live Barcelona, with own photos, a real case and sources for every delicate claim.

**Purpose:** explain what quality means to Google, how it is applied and how long a recovery takes after a core update. YMYL: no.

| Pillar | Score | Evidence | Fix |
|---|---|---|---|
| Effort | 4/4 | 5.000 words, 17 images (photos of slides by the author and by Estela Franco, with credit), a recovery time table, Softonic case, 30 dated references (rater guidelines, Google docs, DOJ trial notes, patents, leak), lead magnet with own skill. | Already at the maximum. |
| Originality | 3/4 | What is its own: presence in the room, photos of slides, "never (quality)" timings for sitemaps, indexing and structured data, the Softonic languages story and his reading on quality in AI Overviews. What is not its own: the review of the leak and of Q* has already been done by Mike King, SparkToro or SEJ, and there are event recaps (We Are ROAST, Marie Haynes). | Publish the original data that would make it a source: results of running the skill on several large sites (anonymized), with which page types come out worst. |
| Talent or skill | 3/4 | TL;DR, index, H2s phrased as questions, tables, clearly separates what is documented from "mi lectura". Drawbacks: the skill block appears twice in the body; many English terms left untranslated ("quality", "page type", "effort"); the length calls for more intermediate summaries. | Keep a single skill block (at the end) and add a summary line at the start of the long sections. |
| Accuracy | 3/4 | Verifiable literal quotes, labels what is deduction ("Que ese campo sea la versión algorítmica del pilar de effort es una deducción mía"), warns that the "naranja" data was only seen on the slide. Details: the header says "3 de octubre de 2026" but the text tells of something done "el 4 de octubre de 2026" and there is no update date or `dateModified`; "El llms.txt, Google lo ignora" is more categorical than the cited guidance ("You don't need to create… AI text files"). | Show "Actualizado el…" and add `dateModified`; soften to "Google dice que no hace falta y no consta que lo use". |

**Commodity**
- Swap test: passes. Without attendance at the event, the photos and the Softonic case, it would be one more leak summary.
- Top 10 test: partly checked. For the query on recovery after a core update the results are generic guides (Surfer, W3era, Wordtracker) with no data from the event; none has Google's timing table or the "never (quality)".
- Only-you assets used: own photos, event account, Softonic case, own skill.
- Non-commodity angle to reach 4: the audit dataset proposed above.

**Red flags:** none. The double lead magnet block is a bit of noise, without reaching the clutter level that `clutterScore` penalizes.

---

### 6. SEO Hacks archive (2015–2017)

#### Page audited: ¿Qué considera Google que es el "Thin Content" en realidad?

**Verdict:** At risk (6/16, commodity). A 2015 post with the same list of thin content types that Google and the top 10 already give, a tone from that era and a 2026 note that corrects the one serious error.

**Purpose:** explain what Google understands by thin content and what to do with poor pages. YMYL: no.

| Pillar | Score | Evidence | Fix |
|---|---|---|---|
| Effort | 2/4 | Written by a person, with one practical tip of its own ("crear una página en la que englobar todas las noticias") and a substantial October 2026 note on robots.txt versus noindex. No data, examples or own images. | If kept, add a real example (before/after of consolidating short news items). |
| Originality | 1/4 | The four types (auto-generated, affiliate feeds, duplicate, doorway) are the list from Google's manual action "Thin content with little or no added value" and the same ones SE Ranking gives in its article for "qué es thin content Google". | None that is cheap: what is original is already in the new quality post. |
| Talent or skill | 1/4 | Readable but in the register of 2015: "¡NO PENALIZA!", "Pandazo", "TIER 2 o incluso los TIER 3", "recuerda hacerlo en una web que no sea tu Money Site", "Un término del que se ha empezado a hablar recientemente" (from 2015), "manual de webmasters" with no link. It does not answer today's searcher, who expects the relationship with Panda, the helpful content system and core updates. | Consolidate (see below). |
| Accuracy | 2/4 | After the note, the essentials are correct (short content does not penalize; technical duplication is solved with canonical). Still outdated are the treatment of doorways as news and the absence of any reference to the current state (helpful content integrated into the core in 2024). [Auditor judgment] | If it stays, a closing note linking to the quality post. |

**Commodity**
- Swap test: fails. Under another name, the reader loses nothing.
- Top 10 test: checked with "qué es thin content Google" (IEBS, Cyberclick, SE Ranking, Semrush, Rank Math, SEOcrawl). All give the same definition and the same typology.
- Only-you assets used: none, except the tip to group news items.
- Non-commodity angle: "Cómo decidimos en Softonic qué páginas generadas retirar", with the demand criterion and the indexing data. It fits better as a section of the quality post or of the Softonic case study than as a separate post.

**Red flags:** none from Lowest. It fits the description of 5.2.1 (low effort and little added value compared with what already exists). The date "Actualizado el 5 de octubre de 2026" is justified here by the note, but see the observation on dates in the rest of the archive.

#### Overview of the rest of the archive (19 posts, `category: seohacks`)

I reviewed the title, opening and notes of the 19 posts in `src/content/blog/es/`:

- **18 of 19 have a 2026 note or a "Qué sigue vigente en 2026" section.** They are real corrections and well done (UA → GA4, noindex in robots.txt since 2019, LSI, Penguin 4.0, SSL Flexible, etc.).
- **`relacion-semantica-inversa` has no note** and its `updatedDate` is still 2016. It is a hypothesis with no data ("lanzando una hipótesis basada en la observación") published without qualification.
- **Several posts teach techniques against the spam policies** even though they now carry a warning: `cloaking` (a practical case of hacking + parasite SEO + cloaking), `analizando-tecnica-seo-piel-de-cordero` ("Analizando la técnica Black Hat"), `link-building-alex-navarro` (pyramids with PBN, "Tener una PBN en un segundo nivel te asegura que si la competencia te hace un spam report…"), `imagenes-originales` (the title promises "hacer creer a Google que tus imágenes son originales (cuando no lo son)") and `el-dia-a-dia-de-un-seo-en-gifs` (PBN). On the site of someone who sells quality audits, this contradicts the message.
- **2015 tone and format** in almost all ("¡Hola, querido lector!", "¡Entra Ya!" in the meta description of `https-gratis`) and no images in 15 of 19 because of the Internet Archive recovery.
- **All carry `updatedDate: 2026-10-05`** and the same `dateModified`. The notes are real changes, but 18 posts updated on the same day with a short note on top of a 2015 body looks like what Google advises against (changing the date without a substantial change). [Auditor judgment]
- What is worth keeping: `ddos` (own experience, 120,000 visits lost), `crawl-budget-optimizar-http-304` (technical and still useful), `seo-tips-gary-illyes` (a compilation with some historical value) and the two Quality Raters/E-A-T posts, whose topic the new post already covers better.

**Page type verdict:** At risk. None of it is spam, but as a whole it is commodity or outdated content with a minority of pieces of its own.

---

### Page type and site view

Count from `dist/sitemap-0.xml`: 66 indexable URLs (43 in Spanish, 23 in English).

| Page type | URLs (ES + EN) | Fit with focus | Recommendation |
|---|---|---|---|
| Home | 1 + 1 | Total | Improve (verifiable proof, less repetition) |
| Services | 4 + 4 (+ hubs) | Total | Improve (own angle in process and FAQ, indicative price) |
| Case studies | 4 + 4 (+ hubs) | Total | Improve (charts, dates, detail on the "how") |
| Tools | 2 + 2 (+ hubs) | High | Improve (publish own data with the tool) |
| Skills | 1 + 1 (+ hubs) | High | Keep |
| New blog | 2 + 2 | High | Keep and publish more (there is only one 2026 post and one from 2023) |
| SEO Hacks archive | 19 + 0 (+ hub) | Medium: it is SEO, but 2015 tactics and black hat | Consolidate, noindex or remove most of it |
| Legal and contact | 3 + 3 | Neutral | Keep |

What weighs on the site:

- **Proportion.** The archive is 19 of the 43 Spanish URLs (44%) and 19 of the 21 posts on the Spanish blog. For Google, most of the site's "editorial content" is SEO Hacks. The quality post itself says it: weak pages drag down the good ones.
- **Focus.** The topic (SEO) is the same, so `siteFocusScore` should not suffer much. What strays from the current core (SEO, GEO and AI consulting for large sites) is the WordPress tutorials, HTTPS with Cloudflare, GIFs and the black hat tactics. [Inference]
- **Brand coherence.** The pieces on cloaking, PBN and "original images when they are not" go against the quality message the site sells.
- **English.** The EN versions of home, services, case studies, tools and the two new posts are linked with hreflang. The archive has no EN version, so the English part of the site is cleaner than the Spanish one.

Recommendation for the archive (no traffic data; if any post brings visits or links, review it first):

| Action | Posts |
|---|---|
| Improve and keep | `ddos`, `crawl-budget-optimizar-http-304` |
| Consolidate with a 301 to the quality post | `guia-quality-raters-google`, `credibilidad-vs-autoridad-eat`, `que-es-thin-content` |
| Noindex (they stay as an archive for anyone arriving through a link) | `seo-tips-gary-illyes`, `guia-seo`, `200-factores-seo-que-posicionan-en-google`, `analisis-pagina-web-seo-on-page`, `accesibilidad-web-seo-parte-1`, `contenido-latent-semantic-index`, `creando-blog-seo-wordpress`, `https-gratis`, `el-dia-a-dia-de-un-seo-en-gifs` |
| Noindex or remove (black hat or hypothesis with no basis) | `cloaking`, `analizando-tecnica-seo-piel-de-cordero`, `link-building-alex-navarro`, `imagenes-originales`, `relacion-semantica-inversa` |

If you prefer not to touch indexing, the minimal alternative is to take the archive out of the sitemap and keep update dates only where the note changes the meaning of the post.

---

### Related Google signals

| Finding | Signal | Evidence |
|---|---|---|
| Archive with little effort of its own versus the new post, with a lot | `contentEffort` | Description "LLM-based effort estimation for article pages" [Documented]; that it measures the same as the Effort pillar [Inference] |
| 44% of the Spanish URLs are commodity posts from 2015–2017 | `chardEncoded`, `tofu` (site) | "site quality predictor based on content" [Documented]; that the archive lowers that rating [Inference] |
| Archive posts well below the level of the rest of the site | `rhubarb` | "Site-URL delta signals based quality score" [Documented]; applying it to this case [Inference] |
| WordPress/HTTPS tutorials, GIFs and black hat far from the current core | `siteFocusScore`, `siteRadius` | Descriptions [Documented]; that these posts increase the radius [Inference] |
| A consultant's personal website | `smallPersonalSite` | "Score of small personal site promotion" [Documented]; whether it applies to this site [Hypothesis] |
| No ads or popups; one repeated lead magnet in the new post | `clutterScore` | Description [Documented]; low risk here [Auditor judgment] |
| Archive posts with little demand and value could fall into low tiers or go unindexed | `scaledSelectionTierRank` | Score over tiers Base, Zeppelins, Landfills [Documented]; Base better and Landfills worse [Inference] |
| Quality computed per page but with site signals | Q* (DOJ trial, HJ Kim's notes) | "generally static across multiple queries" [Documented] |

---

### Priority actions

1. **Reduce the weight of the archive before publishing.** Apply the table above: 301 the three posts that the quality post covers, noindex or remove the five black hat or baseless ones, and noindex the rest except `ddos` and `crawl-budget`. At a minimum, take them out of the sitemap and add a note to `relacion-semantica-inversa`.
2. **Review the archive dates.** Keep `updatedDate` only where the note really changes the advice; on the rest, show "Nota añadida en 2026" without touching `dateModified`.
3. **Put proof in the case studies.** A chart or screenshot per main figure, dates and the name of the core update at Softonic, and a "how" with examples. This raises the accuracy of home, services and case studies at once.
4. **Give the consulting service its own angle.** Replace the generic SEO/AEO/GEO FAQ with a case of measuring AI citations, clarify the fixed price point and remove the sentence "No es otro servicio con un nombre de moda: es el mismo trabajo bien hecho".
5. **Turn the tool into a source.** Publish a study with it (AI bot blocking on Spanish sites) and fix the `startsWith` matching to an exact token match.
6. **Polish the quality post.** A single skill block, `dateModified` and "Actualizado el…" consistent with the mention of 4 October, and soften the llms.txt point.
7. **Home.** Unify the years of teaching, say the former Google engineers claim only once and link the media mentions.
8. **Editorial pace.** With a single 2026 post, the blog depends on the archive. Two or three more non-commodity pieces (audit dataset, bot study, a measured GEO case) would change the proportion of the site.
