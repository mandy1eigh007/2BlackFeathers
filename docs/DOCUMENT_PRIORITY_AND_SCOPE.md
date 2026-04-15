# BLACKFEATHER — DOCUMENT PRIORITY AND SCOPE

**Version:** 1.0.0  
**Last Updated:** 2026-04-14

---

## Purpose

This document declares which source documents govern which domains, which versions are canonical, and which older documents are archived reference only.

**This is the authority map for the entire BLACKFEATHER system.**

---

## Entry Gate Rule (CRITICAL)

**No new asset, component, page, or story element may be introduced unless:**

1. It maps to an existing canonical role, **OR**
2. A new role is formally added to:
   - `brand-system.ts` (if visual)
   - `story-system.ts` (if narrative)

**If neither condition is met, the addition is rejected.**

This rule exists because clean systems die from "just one extra thing."

### How to add something new

1. Check if a canonical role already exists
2. If not, open a formal addition:
   - Increment `BRAND_SYSTEM_VERSION` or `STORY_SYSTEM_VERSION`
   - Add to `CHANGE_LOG`
   - Update this document
3. Only then create the asset/component/element
4. Run `runFullSystemValidation()` before committing

---

## Source Hierarchy

### TIER 1 — Absolute Authority

These documents override all others. No lower-tier document may contradict them.

| Document | Domain | Status |
|----------|--------|--------|
| `BLACKFEATHER_Brand_Standards_Manual.docx` | Visual identity, asset roles, logo usage, color, typography | **CANONICAL** |
| `BLACKFEATHER_Governance_Rules.docx` | System hierarchy, asset classification, naming, validation, change control | **CANONICAL** |
| `brand-system.ts` | Code implementation of Tier 1 rules | **CANONICAL** |

### TIER 2 — Domain Control

These documents have authority within their specific domain. They do not override Tier 1.

| Document | Domain | Status |
|----------|--------|--------|
| `Blackfeather_App_SpinOff_Series_Bible_v4.docx` | App content: episodes, hooks, micro-arcs, character builders, retention | **CANONICAL** |
| `Series_Bible_Market_Aligned_Epic_Dark_Fantasy.docx` | Long-form series: novel structure, book-level arcs, market positioning | **CANONICAL** |
| `story-system.ts` | Code implementation of narrative rules | **CANONICAL** |

### TIER 3 — Build-Order and Craft Support

These documents provide methodology and tools. They support Tiers 1 and 2 but do not override them.

| Document | Purpose | Status |
|----------|---------|--------|
| `Master_Story_System_Index.docx` | Build order: theme → character → magic → relationships → world → arc → scenes | **ACTIVE** |
| `Epic_Novel_Success_Framework.docx` | Foundational craft principles | **ACTIVE** |
| `Reversal_Tracking_System.xlsx` | Blank reversal tracker template | **ACTIVE** |
| `Prefilled_Reversal_Tracker.xlsx` | Example reversal tracker with data | **ACTIVE** |

### ARCHIVED — Reference Only

These documents are superseded. Do not use for production decisions.

| Document | Superseded By | Status |
|----------|---------------|--------|
| `BLACKFEATHER_Brand_Standards_Manual (1).docx` | `BLACKFEATHER_Brand_Standards_Manual.docx` | **ARCHIVED** |
| `BLACKFEATHER_Governance_Rules (1).docx` | `BLACKFEATHER_Governance_Rules.docx` | **ARCHIVED** |
| `Blackfeather_App_SpinOff_Series_Bible_v3.docx` | `Blackfeather_App_SpinOff_Series_Bible_v4.docx` | **ARCHIVED** |

---

## Domain Authority Rules

### Website / Visual Work

**Authority chain:**
1. Brand Standards Manual
2. Governance Rules
3. `brand-system.ts`

**Key rules:**
- Black / crimson / gold palette (locked)
- Feather crown = main brand anchor
- Crest = navigation, footer, small UI
- Ember hero crown = promotional/hero only
- Arcane sigil = chapter thumbnails
- One dominant focal point per hero section
- Slow atmospheric motion only

### App Storytelling

**Authority chain:**
1. App Spin-Off Series Bible v4
2. `story-system.ts`
3. Master Story System Index

**Key rules:**
- Mobile-first, vertical-safe, 60-90 second episodes
- Hook in first 3 seconds
- 1 reversal minimum per episode
- Exit requirement: destabilized, never neutral
- Binge clusters: 3, 5, 10 episodes
- No plateau > 2 episodes

### Long-Form Series Planning

**Authority chain:**
1. Series Bible: Market-Aligned Epic Dark Fantasy
2. Master Story System Index
3. Epic Novel Success Framework

**Key rules:**
- 4-book structure recommended
- Reversal density per chapter, act, volume
- Read-through optimization
- Each book = complete emotional unit + series continuation

---

## Conflict Resolution

When documents disagree:

1. **Higher tier wins** — Tier 1 overrides Tier 2, Tier 2 overrides Tier 3
2. **Domain-specific wins** — App Bible wins for app content, Series Bible wins for novels
3. **Code wins over stale docs** — If `brand-system.ts` or `story-system.ts` has been updated more recently than a doc, code is authoritative
4. **When in doubt, ask** — Flag the conflict rather than guessing

---

## Canonical Asset Filenames

These are the ONLY approved production filenames:

| Asset | Filename | Format | Role |
|-------|----------|--------|------|
| Hero background | `hero-throne.jpg` | JPG | Landing page hero |
| Primary logo | `logo-crest.png` | PNG | Navigation, footer, favicon, badges |
| Full logo | `logo-full.png` | PNG | Hero section, promotional |
| Saga: Fallen Queen | `saga-fallen-queen.jpg` | JPG | Saga card cover |
| Saga: Ashen Blade | `saga-ashen-blade.jpg` | JPG | Saga card cover |
| Chapter thumbnail | `chapter-sigil.png` | PNG | Chapter rows, grid |
| Smoke overlay | `smoke-overlay.png` | PNG | Atmospheric layer |

**Note:** `chapter-thumb-template.jpg` is deprecated. Use `chapter-sigil.png`.

---

## Version Control

### Current Versions

| System | Version |
|--------|---------|
| Brand System | 2.1.0 |
| Story System | 1.0.0 |
| This Document | 1.0.0 |

### Update Protocol

1. Increment version when any canonical document changes
2. Update `CHANGE_LOG` in `brand-system.ts`
3. Update this document if hierarchy changes
4. Archive old versions, don't delete

---

## Quick Reference

### "I'm working on the website"
→ Use: Brand Standards Manual, Governance Rules, `brand-system.ts`

### "I'm writing app episodes"
→ Use: App Spin-Off Series Bible v4, `story-system.ts`

### "I'm planning the novel series"
→ Use: Series Bible Market-Aligned, Master Story System Index

### "I'm tracking reversals"
→ Use: Reversal_Tracking_System.xlsx, Prefilled example

### "I'm not sure which doc to use"
→ Check this document first. If still unclear, flag the conflict.

---

## File Organization

### Recommended Folder Structure

```
blackfeather/
├── docs/
│   ├── authority/
│   │   ├── BLACKFEATHER_Brand_Standards_Manual.docx
│   │   ├── BLACKFEATHER_Governance_Rules.docx
│   │   └── DOCUMENT_PRIORITY_AND_SCOPE.md
│   │
│   ├── story/
│   │   ├── Blackfeather_App_SpinOff_Series_Bible_v4.docx
│   │   ├── Series_Bible_Market_Aligned_Epic_Dark_Fantasy.docx
│   │   ├── Master_Story_System_Index.docx
│   │   └── Epic_Novel_Success_Framework.docx
│   │
│   ├── tools/
│   │   ├── Reversal_Tracking_System.xlsx
│   │   └── Prefilled_Reversal_Tracker.xlsx
│   │
│   └── archive/
│       ├── BLACKFEATHER_Brand_Standards_Manual (1).docx
│       ├── BLACKFEATHER_Governance_Rules (1).docx
│       └── Blackfeather_App_SpinOff_Series_Bible_v3.docx
│
├── src/config/
│   ├── brand-system.ts
│   ├── brand-enforcement.ts
│   ├── story-system.ts
│   └── story-validation.ts
│
└── public/images/
    └── (canonical assets only)
```

---

## Summary

BLACKFEATHER is a **controlled operating system**, not a pile of documents.

- **Tier 1** = absolute visual/governance authority
- **Tier 2** = domain-specific narrative authority
- **Tier 3** = methodology and tools
- **Archived** = do not use for production

When in doubt, check this document.

---

*This document exists to prevent drift, resolve conflicts, and maintain system integrity.*
