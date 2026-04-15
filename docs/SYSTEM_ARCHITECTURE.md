# BLACKFEATHER — SYSTEM ARCHITECTURE

**Version:** 2.1.0  
**Last Updated:** 2026-04-14

---

## Overview

BLACKFEATHER is a **governed brand system** with enforcement at multiple layers. This document explains how the documentation, code, and enforcement mechanisms connect.

---

## System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BLACKFEATHER SYSTEM                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐      ┌─────────────────┐                     │
│   │   TIER 1        │      │   TIER 2        │                     │
│   │   Documents     │ ───▶ │   Code          │                     │
│   │                 │      │                 │                     │
│   │ • Brand Manual  │      │ • brand-system  │                     │
│   │ • Governance    │      │ • brand-valid   │                     │
│   │                 │      │ • brand-enforce │                     │
│   └─────────────────┘      └────────┬────────┘                     │
│                                     │                               │
│                                     ▼                               │
│                         ┌─────────────────┐                        │
│                         │   TIER 3        │                        │
│                         │   Enforcement   │                        │
│                         │                 │                        │
│                         │ • Pre-commit    │                        │
│                         │ • Build check   │                        │
│                         │ • CI pipeline   │                        │
│                         └────────┬────────┘                        │
│                                  │                                  │
│                                  ▼                                  │
│                         ┌─────────────────┐                        │
│                         │   PRODUCTION    │                        │
│                         │   Website       │                        │
│                         └─────────────────┘                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Source of Truth Hierarchy

When conflicts arise, decisions follow this order:

| Priority | Source | Location |
|----------|--------|----------|
| 1 | Brand Standards Manual | `/docs/brand-manual.md` |
| 2 | Governance Document | `/docs/governance.md` |
| 3 | brand-system.ts | `/src/config/brand-system.ts` |
| 4 | Current Implementation | `/src/components/*` |
| 5 | Exploratory Assets | Not authoritative |

**No lower-tier item may override a higher-tier item.**

---

## File Structure

```
blackfeather/
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md    ◀── You are here
│   ├── brand-manual.md
│   └── governance.md
│
├── src/
│   ├── config/
│   │   ├── index.ts              # Barrel export
│   │   ├── brand-system.ts       # All rules as typed constants
│   │   ├── brand-validation.ts   # Basic validation utilities
│   │   └── brand-enforcement.ts  # Component, layout, CI enforcement
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SagaCard.tsx
│   │   ├── ChapterCard.tsx
│   │   └── ...
│   │
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
│
├── public/
│   └── images/
│       ├── hero-throne.jpg       # ASSET_PATHS.hero
│       ├── logo-crest.png        # ASSET_PATHS.crest
│       ├── logo-full.png         # ASSET_PATHS.logoFull
│       ├── saga-fallen-queen.jpg # ASSET_PATHS.sagaFallenQueen
│       ├── saga-ashen-blade.jpg  # ASSET_PATHS.sagaAshenBlade
│       ├── chapter-sigil.png     # ASSET_PATHS.chapterSigil
│       └── smoke-overlay.png     # ASSET_PATHS.smoke
│
└── scripts/
    └── brand-check.ts            # CI script
```

---

## Rule ID System

Every rule has a traceable ID linking docs ↔ code ↔ enforcement.

### ID Format
```
RULE-XXX: rule-name
```

### ID Ranges

| Range | Category | Example |
|-------|----------|---------|
| 001-099 | Governance | RULE-001: source-hierarchy |
| 100-199 | Components | RULE-100: component-button |
| 200-299 | Layout | RULE-200: layout-page |
| 300-399 | Enforcement | RULE-300: focal-point-limit |

### Traceability

```
docs/governance.md     →  "RULE-001: Source of Truth Hierarchy"
src/config/brand-system.ts  →  RULE_IDS.RULE_001 = 'source-hierarchy'
src/config/brand-enforcement.ts  →  ruleId: 'RULE-001' in ValidationResult
```

---

## Enforcement Points

### 1. Pre-Commit Hook (Husky)

**Location:** `.husky/pre-commit`

**Runs:** `preCommitCheck()`

**Behavior:**
- Validates staged files against brand rules
- Blocks commit if BRAND_STRICT_MODE = true and violations exist
- Logs warnings if BRAND_STRICT_MODE = false

### 2. Build Check

**Location:** `next.config.js` or `vite.config.ts`

**Runs:** `buildCheck()`

**Behavior:**
- Validates all pages and components
- Fails build on any error-level violation
- Outputs human-readable failure messages

### 3. CI Pipeline

**Location:** `.github/workflows/brand-check.yml`

**Runs:** Full validation suite

**Behavior:**
- Checks asset existence
- Validates all components
- Validates all layouts
- Fails pipeline on violations
- Generates compliance report

---

## Mode Switches

### BRAND_STRICT_MODE

```ts
BRAND_STRICT_MODE = true   // Violations = failure
BRAND_STRICT_MODE = false  // Violations = warning
```

Set via: `BLACKFEATHER_STRICT_MODE` environment variable

### PRODUCTION_LOCK

```ts
PRODUCTION_LOCK = true     // Only 'approved-production' assets
PRODUCTION_LOCK = false    // Allow 'approved-alternate' assets
```

Set via: `BLACKFEATHER_PRODUCTION` environment variable

---

## Validation Functions

### Basic Validation

| Function | Purpose |
|----------|---------|
| `validateColor(hex)` | Check color in palette |
| `canUseAssetInContext(asset, ctx)` | Check asset role boundaries |
| `isAnimationAllowed(type)` | Check motion rules |
| `validateThumbnailDimensions(w, h)` | Check aspect ratio |

### Component Validation

| Function | Purpose |
|----------|---------|
| `validateComponent(config)` | Full component check |
| `validateLayout(config)` | Layout structure check |
| `validateFocalPoints(elements)` | Single focal point rule |
| `validateMotionBudget(section, anims)` | Animation overload check |
| `validateVisualDensity(section, elements)` | Clutter prevention |

### Build Enforcement

| Function | Purpose |
|----------|---------|
| `enforceCompliance(id, results)` | Throws on violations |
| `preCommitCheck(configs)` | Git hook integration |
| `buildCheck()` | Build pipeline integration |

---

## Asset Management

### Canonical Paths

All asset references MUST use `ASSET_PATHS`:

```ts
// ✅ Correct
<img src={`/images/${ASSET_PATHS.hero}`} />

// ❌ Wrong — hardcoded filename
<img src="/images/hero-throne.jpg" />
```

### Asset Metadata

Every asset has metadata defining what it CAN do:

```ts
ASSET_METADATA.crest = {
  filename: 'logo-crest.png',
  status: 'approved-production',
  role: 'primary-logo',
  allowedContexts: ['navigation', 'footer', 'favicon'],
  minDisplaySize: 16,
  backgroundRequirement: 'dark',
  transparencyRequired: true,
}
```

### Existence Validation

Before build:
```ts
validateAssetExists(ASSET_PATHS.hero)  // Confirms file exists
```

---

## Change Control Protocol

### Making Changes

1. **Increment version** in `BRAND_SYSTEM_VERSION`
2. **Add entry** to `CHANGE_LOG` array
3. **Update rule** in code with same `RULE-XXX` ID
4. **Update documentation** with matching ID
5. **Run validation** to confirm no breaks
6. **Update this document** if architecture changes

### Impact Levels

| Level | When to Use |
|-------|-------------|
| `patch` | Bug fixes, clarifications |
| `minor` | New rules, new validators |
| `major` | Breaking changes, rule removals |

---

## Error Message Format

All violations output human-readable messages:

```
🚫 BLACKFEATHER VIOLATION [RULE-004]

Color #FF0000 is not in the approved palette.

Allowed colors:
  • Black: #0B0B0B, #111111, #141414
  • Crimson: #5A0A0A, #8B0000, #7A0E0E
  • Gold: #D4AF37, #B8962E, #8C6B1F

Location: src/components/BadButton.tsx:24

→ Replace with approved color or register override.
```

---

## Override Protocol

When exceptions are needed:

```ts
overrideRule(
  'RULE-004',                           // Rule ID
  'Promotional banner requires red',    // Justification
  'Design Lead',                        // Approver
  '2026-05-01'                          // Expiration (optional)
);
```

All overrides are:
- Logged
- Auditable via `getActiveOverrides()`
- Time-limited (recommended)

---

## Quick Reference

### Check if compliant:
```ts
const results = validatePage(pageConfig);
const isClean = isFullyCompliant(results);
```

### Block on violations:
```ts
enforceCompliance('HomePage', results);
```

### Get asset for context:
```ts
const logo = getLogoForContext('navigation');  // → 'logo-crest'
```

### Check color:
```ts
const ok = isApprovedColor('#D4AF37');  // → true
```

---

## Summary

BLACKFEATHER is a **locked system**.

| Layer | Purpose |
|-------|---------|
| Docs | Define rules |
| Code | Encode rules |
| Enforcement | Block violations |

Every rule has an ID. Every asset has metadata. Every violation has a message.

The system stays aligned because:
1. Rule IDs link docs ↔ code
2. Version numbers track changes
3. CI blocks non-compliant deploys
4. Overrides are logged and auditable

**This document exists to prevent drift, preserve identity, and maintain build integrity.**
