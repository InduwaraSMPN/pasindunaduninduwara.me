# Review — draft-v1.md

**Composite score:** 91/100
**Gate status:** PASS

| Category | Score | Notes |
| --- | --- | --- |
| Substance | 19/20 | Strong technical grounding, real file paths and line numbers cited, honest tradeoff discussion in §9, named author voice consistent. Minor: a few concrete claims (e.g., "33.3k stars") cannot be independently verified at draft time. |
| Structure | 19/20 | Clean H1 → H2 → H3 hierarchy, answer-first paragraphs throughout, two citation capsules, FAQ exactly 5, Mermaid diagram present. Minor: H1 is in title case rather than sentence case. |
| SEO / GEO | 18/20 | Primary keyword "incremental entity provider for backstage" appears in title, H1, intro, and a section heading; secondary keywords (cursor pagination, mark-and-sweep, Backstage catalog) used naturally; 7+ distinct tier-1/tier-2 inline citations. Internal-link TODOs are still placeholders (3 of them), and the description and title both exceed target length. |
| Voice | 18/20 | First-person consistent, sentence rhythm varies, conversational technical tone, honest "what I got wrong" section is specific (the September 2025 orphan bug). One sentence fragment ("One thing I want to flag explicitly.") reads as deliberate emphasis. |
| AI-tells | 17/20 | Zero em-dashes, zero en-dashes used as stylistic dashes, zero curly quotes, zero banned-vocabulary hits, no knowledge-cutoff disclaimers, no chatbot phrasing. Minor concerns: rule-of-three constructions appear several times (lines 33–37, 47–49, 145–147, 239); "at its center" on line 60 is close to but not the banned "at its core". |

## Required-content check

- [x] One H1 only (line 12 only; line 211 is `# app-config.yaml` inside a YAML code fence and does not render as a heading).
- [x] Exactly 3 code excerpts (TS at lines 78–102, Go at lines 159–185, YAML at lines 210–224).
- [x] Exactly 1 Mermaid diagram (lines 108–128).
- [x] ≥ 5 distinct external citations as inline links: DORA 2025, CNCF/SlashData Q1 2026, CNCF 2025 Annual Survey, backstage/backstage repo, CNCF Backstage project page, Backstage external-integrations docs, Kubernetes API conventions. 7 distinct external sources.
- [x] Verbatim sentence is present (line 140).
- [x] Section 4 (lines 56–72) explicitly rejects the K8s GC analogy at line 64.
- [x] Section 7 (lines 153–193) uses the Kubernetes `continue` + `ResourceVersion` + `410 Gone` analogy.
- [x] "shipped to PR / under review, not merged" appears on lines 76, 191, 260, 261.
- [x] §9 contains a specific first-try mistake admission (line 230 + bullets at 234–237).
- [x] FAQ has exactly 5 entries, each answer ≤ 60 words.
- [~] Frontmatter is valid YAML, but description = 167 chars (target ≤ 155) and title = 71 chars (target ≤ 60).
- [x] Word count: body ~2,250 words, total file ~2,650 words. Within window.

## High-severity issues (must fix to pass)

None. Gate criteria met.

## Medium-severity issues (should fix)

- Line 2 — title 71 chars, over 60 target.
- Line 3 — description 167 chars, over 155 target.
- Line 12 — H1 in title case; should be sentence case.
- Lines 19, 130, 256 — three internal-link TODOs remain (intentional per brief; flagged for user pre-publish).
- Line 43 — "33.3k GitHub stars" should be timestamped or softened.

## Low-severity issues (optional)

- Line 60 — "at its center" near-neighbor of banned "at its core".
- Line 64 — sentence fragment opener "One thing I want to flag explicitly."
- Lines 33–37, 47–49, 142–146 — three rule-of-three structures across the post.
- Lines 76, 191, 260, 261 — "shipped to PR, under review, not merged" repeated 4 times.
- Line 211 — YAML excerpt is illustrative (clean version of the README block), not a literal cat of the on-disk file (which has unresolved merge conflict at lines 166–172).
- Line 64 — "K8s GC" abbreviation vs full "Kubernetes" elsewhere.
- Consider adding a short author capsule under the hero for stronger E-E-A-T.

## AI-detection signal flags

- Em-dashes (U+2014): 0.
- En-dashes (U+2013) stylistic: 0.
- Curly quotes: 0.
- Banned vocabulary: 0.
- Mechanical hyphenation in non-modifier position: 0.
- Knowledge-cutoff disclaimers: 0.
- Generic chatbot phrasing: 0.
- Copula avoidance: not at concerning frequency.
- Heading-case violations: 1 (H1 only).
- Rule-of-three padding: 3 instances. Below high-severity threshold.

## Word count

- Body: ~2,250 words.
- Total file: ~2,650 words.
- Both within 2,000–3,000.

## Recommended action

PASS as-is meets the gate. Optional 10-minute polish:
1. Frontmatter title (line 2) and description (line 3) length.
2. Line 12 H1 sentence-case rewrite.
3. Lines 19, 130, 256 internal-link TODOs (resolve at publish or leave for user).

No structural rewrite required.
