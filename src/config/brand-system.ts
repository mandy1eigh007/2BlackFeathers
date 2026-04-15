/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                              B L A C K F E A T H E R                         ║
 * ║                                                                              ║
 * ║                    GOVERNANCE & IMPLEMENTATION RULES                         ║
 * ║                           SOURCE OF TRUTH                                    ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file defines NON-NEGOTIABLE rules governing asset use, design decisions,
 * and system integrity for the BLACKFEATHER brand and website build.
 * 
 * These rules OVERRIDE exploratory design choices and PREVENT visual or structural drift.
 * 
 * BLACKFEATHER is a LOCKED SYSTEM.
 * - Do not redesign approved elements unless explicitly directed
 * - Do not introduce conflicting styles
 * - Do not dilute the palette, tone, or structure
 * 
 * All work must reinforce the established identity.
 * 
 * @version 2.1.0
 * @lastUpdated 2026-04-14
 */

// =============================================================================
// SYSTEM VERSION & PRODUCTION LOCK
// =============================================================================

/**
 * Brand system version — MUST match version in:
 * - Brand Standards Manual
 * - Governance Document
 * - SYSTEM_ARCHITECTURE.md
 * 
 * Increment on ANY rule change.
 */
export const BRAND_SYSTEM_VERSION = '2.1.0';

/**
 * Production lock — when TRUE:
 * - Only 'approved-production' assets allowed
 * - No 'approved-alternate' assets
 * - No 'exploratory-only' assets
 * 
 * Enable for production builds.
 */
export const PRODUCTION_LOCK = process.env.BLACKFEATHER_PRODUCTION === 'true' || false;

// =============================================================================
// RULE ID REGISTRY — TRACEABILITY SYSTEM
// =============================================================================

/**
 * Every rule has a traceable ID.
 * Format: RULE-XXX
 * 
 * Map: docs → code → enforcement
 * When updating rules, update BOTH docs AND code with same ID.
 */
export const RULE_IDS = {
  // Governance Rules (001-099)
  RULE_001: 'source-hierarchy',
  RULE_002: 'asset-status-classification',
  RULE_003: 'canonical-asset-roles',
  RULE_004: 'color-palette',
  RULE_005: 'typography',
  RULE_006: 'motion-animation',
  RULE_007: 'thumbnail-system',
  RULE_008: 'file-naming',
  RULE_009: 'export-validation',
  RULE_010: 'logo-usage',
  RULE_011: 'character-usage',
  RULE_012: 'website-implementation',
  RULE_013: 'asset-storage',
  RULE_014: 'generation-discipline',
  RULE_015: 'transfer-instruction',
  
  // Component Rules (100-199)
  RULE_100: 'component-button',
  RULE_101: 'component-card',
  RULE_102: 'component-section-header',
  RULE_103: 'component-navbar',
  
  // Layout Rules (200-299)
  RULE_200: 'layout-page',
  RULE_201: 'layout-hero',
  RULE_202: 'layout-sections',
  RULE_203: 'layout-zindex',
  RULE_204: 'layout-grid',
  
  // Enforcement Rules (300-399)
  RULE_300: 'focal-point-limit',
  RULE_301: 'motion-throttling',
  RULE_302: 'visual-density',
  RULE_303: 'spacing-scale',
  RULE_304: 'readability-requirements',
} as const;

export type RuleId = typeof RULE_IDS[keyof typeof RULE_IDS];

// =============================================================================
// CHANGE CONTROL — MODIFICATION PROTOCOL
// =============================================================================

/**
 * CHANGE CONTROL RULE
 * 
 * Any modification to Tier 1 (Brand or Governance) requires:
 * 1. Version increment in BRAND_SYSTEM_VERSION
 * 2. Documented change entry in CHANGE_LOG
 * 3. Review of downstream impact
 * 4. Update of SYSTEM_ARCHITECTURE.md
 * 
 * Unauthorized changes will be rejected by CI.
 */
export interface ChangeLogEntry {
  version: string;
  date: string;
  ruleIds: string[];
  description: string;
  author: string;
  impactLevel: 'patch' | 'minor' | 'major';
}

export const CHANGE_LOG: ChangeLogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-04-14',
    ruleIds: ['RULE_001', 'RULE_002', 'RULE_003', 'RULE_004'],
    description: 'Initial brand system codification',
    author: 'System',
    impactLevel: 'major',
  },
  {
    version: '2.0.0',
    date: '2026-04-14',
    ruleIds: ['RULE_100', 'RULE_200', 'RULE_300', 'RULE_301'],
    description: 'Added component, layout, focal point, and motion enforcement',
    author: 'System',
    impactLevel: 'major',
  },
  {
    version: '2.1.0',
    date: '2026-04-14',
    ruleIds: ['ALL'],
    description: 'Added rule IDs, version lock, production lock, change control, visual density',
    author: 'System',
    impactLevel: 'minor',
  },
];

// =============================================================================
// 0. STRICT MODE — KILL SWITCH
// =============================================================================

/**
 * STRICT MODE controls enforcement behavior.
 * 
 * When TRUE:
 * - Any brand violation = build failure
 * - No warnings allowed
 * - Deploy blocked on non-compliance
 * 
 * When FALSE:
 * - Warnings only (development mode)
 * - Build continues with logged violations
 * 
 * Set via environment variable or direct override.
 */
export const BRAND_STRICT_MODE = process.env.BLACKFEATHER_STRICT_MODE === 'true' || true;

/**
 * Override protocol for exceptions.
 * All overrides must be logged and justified.
 */
export interface RuleOverride {
  ruleId: string;
  justification: string;
  approvedBy: string;
  timestamp: string;
  expiresAt?: string;
}

export const ACTIVE_OVERRIDES: RuleOverride[] = [];

// =============================================================================
// 0.1 CANONICAL ASSET PATHS — SINGLE SOURCE FOR ALL FILENAMES
// =============================================================================

/**
 * ALL asset usage MUST pull from this map.
 * No hardcoding filenames anywhere else in the codebase.
 * 
 * Usage: ASSET_PATHS.hero, ASSET_PATHS.crest, etc.
 */
export const ASSET_PATHS = {
  // Hero
  hero: 'hero-throne.jpg',
  
  // Logos
  crest: 'logo-crest.png',
  logoFull: 'logo-full.png',
  
  // Saga covers
  sagaFallenQueen: 'saga-fallen-queen.jpg',
  sagaAshenBlade: 'saga-ashen-blade.jpg',
  
  // Chapter thumbnails (sigil system)
  chapterSigil: 'chapter-sigil.png',
  
  // Atmospheric
  smoke: 'smoke-overlay.png',
} as const;

export type AssetPath = typeof ASSET_PATHS[keyof typeof ASSET_PATHS];

// =============================================================================
// 0.2 ASSET METADATA — FULL SPECIFICATION PER ASSET
// =============================================================================

/**
 * Complete metadata for each canonical asset.
 * Defines not just WHERE the asset is, but WHAT it is allowed to do.
 */
export interface AssetMetadata {
  filename: string;
  status: 'approved-production' | 'approved-alternate' | 'exploratory-only';
  role: string;
  allowedContexts: string[];
  minDisplaySize: number;           // px - smallest allowed render size
  backgroundRequirement: 'dark' | 'light' | 'any' | 'transparent';
  transparencyRequired: boolean;
  aspectRatio?: string;             // e.g., '16:9', '1:1'
  restrictions?: string[];
}

export const ASSET_METADATA: Record<keyof typeof ASSET_PATHS, AssetMetadata> = {
  hero: {
    filename: 'hero-throne.jpg',
    status: 'approved-production',
    role: 'hero-background',
    allowedContexts: ['hero-section', 'landing-page'],
    minDisplaySize: 320,            // full-width on mobile minimum
    backgroundRequirement: 'any',
    transparencyRequired: false,
    aspectRatio: '16:9',
    restrictions: [
      'Do not use as thumbnail',
      'Do not crop for cards',
      'Must cover full viewport',
    ],
  },
  
  crest: {
    filename: 'logo-crest.png',
    status: 'approved-production',
    role: 'primary-logo',
    allowedContexts: ['navigation', 'footer', 'favicon', 'documents', 'saga-badges', 'small-ui'],
    minDisplaySize: 16,             // favicon size
    backgroundRequirement: 'dark',
    transparencyRequired: true,
    aspectRatio: '1:1',
    restrictions: [
      'Must maintain aspect ratio',
      'Do not place on light backgrounds',
    ],
  },
  
  logoFull: {
    filename: 'logo-full.png',
    status: 'approved-production',
    role: 'logo-with-text',
    allowedContexts: ['hero-section', 'saga-headers', 'promotional'],
    minDisplaySize: 200,            // needs text readability
    backgroundRequirement: 'dark',
    transparencyRequired: true,
    restrictions: [
      'Must NOT be used in navigation',
      'Must NOT be used in small UI elements',
      'Must NOT replace crest in functional contexts',
    ],
  },
  
  sagaFallenQueen: {
    filename: 'saga-fallen-queen.jpg',
    status: 'approved-production',
    role: 'saga-cover',
    allowedContexts: ['saga-card', 'saga-detail-header', 'chapter-thumbnails'],
    minDisplaySize: 120,            // card thumbnail minimum
    backgroundRequirement: 'any',
    transparencyRequired: false,
    aspectRatio: '2:3',             // portrait
    restrictions: [
      'Do not crop face',
      'Do not use as generic background',
    ],
  },
  
  sagaAshenBlade: {
    filename: 'saga-ashen-blade.jpg',
    status: 'approved-production',
    role: 'saga-cover',
    allowedContexts: ['saga-card', 'saga-detail-header', 'chapter-thumbnails'],
    minDisplaySize: 120,
    backgroundRequirement: 'any',
    transparencyRequired: false,
    aspectRatio: '2:3',
    restrictions: [
      'Do not crop blade',
      'Do not use as generic background',
    ],
  },
  
  chapterSigil: {
    filename: 'chapter-sigil.png',
    status: 'approved-production',
    role: 'chapter-thumbnail',
    allowedContexts: ['chapter-row', 'chapter-grid', 'player-thumbnail'],
    minDisplaySize: 64,             // must remain legible at this size
    backgroundRequirement: 'dark',
    transparencyRequired: true,
    aspectRatio: '1:1',             // square sigil
    restrictions: [
      'Single focal object only',
      'High contrast required',
      'Must be readable at 64px',
      'Centered composition mandatory',
    ],
  },
  
  smoke: {
    filename: 'smoke-overlay.png',
    status: 'approved-production',
    role: 'atmospheric-overlay',
    allowedContexts: ['hero-section', 'page-backgrounds', 'transitions'],
    minDisplaySize: 320,
    backgroundRequirement: 'transparent',
    transparencyRequired: true,
    restrictions: [
      'Must be layered, not standalone',
      'Opacity should not exceed 0.6',
    ],
  },
};

// =============================================================================
// ASSET DIMENSION CONSTRAINTS
// =============================================================================

/**
 * Hard dimension requirements for each asset.
 * Validation fails if uploaded asset doesn't meet these specs.
 */
export const ASSET_DIMENSIONS = {
  hero: {
    aspectRatio: '16:9',
    minWidth: 1920,
    minHeight: 1080,
    safeCropZone: 'center-60%',      // Safe area for responsive cropping
    format: 'jpg',
  },
  
  crest: {
    aspectRatio: '1:1',
    minWidth: 512,
    minHeight: 512,
    safeCropZone: 'none',            // Do not crop
    format: 'png',
    transparentBackground: true,
  },
  
  logoFull: {
    aspectRatio: '16:9',
    minWidth: 1200,
    minHeight: 675,
    safeCropZone: 'center-80%',
    format: 'png',
  },
  
  sagaFallenQueen: {
    aspectRatio: '2:3',
    minWidth: 800,
    minHeight: 1200,
    safeCropZone: 'top-70%',         // Preserve face
    format: 'jpg',
  },
  
  sagaAshenBlade: {
    aspectRatio: '2:3',
    minWidth: 800,
    minHeight: 1200,
    safeCropZone: 'center-80%',
    format: 'jpg',
  },
  
  chapterSigil: {
    aspectRatio: '1:1',
    minWidth: 512,
    minHeight: 512,
    safeCropZone: 'none',            // Do not crop
    format: 'png',
    transparentBackground: true,
    legibleAt: 64,                   // Must remain readable at 64px
  },
  
  smoke: {
    aspectRatio: 'any',
    minWidth: 1920,
    minHeight: 1080,
    safeCropZone: 'any',             // Tileable/croppable
    format: 'png',
    transparentBackground: true,
  },
} as const;

export type AssetDimensions = typeof ASSET_DIMENSIONS[keyof typeof ASSET_DIMENSIONS];

// =============================================================================
// 1. SOURCE OF TRUTH HIERARCHY
// =============================================================================

/**
 * When conflicts arise, decisions must follow this order (highest to lowest):
 * 1. Brand Standards Manual
 * 2. Approved Production Assets
 * 3. Current Website Implementation
 * 4. Exploratory / Concept Assets
 * 
 * No lower-tier item may override a higher-tier item.
 */
export const SOURCE_HIERARCHY = [
  'brand-standards-manual',
  'approved-production-assets',
  'current-website-implementation',
  'exploratory-concept-assets',
] as const;

export type SourceTier = typeof SOURCE_HIERARCHY[number];

// =============================================================================
// 2. ASSET STATUS CLASSIFICATION
// =============================================================================

export type AssetStatus = 
  | 'approved-production'    // Final, usable assets for live environments
  | 'approved-alternate'     // Acceptable variations for specific contexts
  | 'exploratory-only';      // Not approved for production use (DEFAULT)

/**
 * CRITICAL: Unlabeled assets are considered EXPLORATORY ONLY by default.
 */
export const DEFAULT_ASSET_STATUS: AssetStatus = 'exploratory-only';

// =============================================================================
// 3. CANONICAL ASSET ROLES
// =============================================================================

/**
 * Each approved asset must have a defined role.
 * No asset may be used outside its assigned purpose.
 */
export type AssetRole =
  | 'hero-background'        // Throne scene for landing page
  | 'primary-crest'          // Crown mark for navigation, footer, favicon
  | 'logo-with-text'         // BLACKFEATHER lockup
  | 'saga-cover'             // Individual saga artwork
  | 'chapter-thumbnail'      // Sigil-based chapter imagery
  | 'atmospheric-overlay';   // Smoke, embers, texture layers

export interface CanonicalAsset {
  role: AssetRole;
  filename: string;
  status: AssetStatus;
  allowedContexts: string[];
  restrictions?: string[];
}

export const CANONICAL_ASSETS: Record<string, CanonicalAsset> = {
  'hero-throne': {
    role: 'hero-background',
    filename: 'hero-throne.jpg',
    status: 'approved-production',
    allowedContexts: ['hero-section', 'landing-page'],
    restrictions: ['Do not use as thumbnail', 'Do not crop for cards'],
  },
  'logo-crest': {
    role: 'primary-crest',
    filename: 'logo-crest.png',
    status: 'approved-production',
    allowedContexts: ['navigation', 'footer', 'favicon', 'documents', 'saga-badges', 'small-ui'],
  },
  'logo-full': {
    role: 'logo-with-text',
    filename: 'logo-full.png',
    status: 'approved-production',
    allowedContexts: ['hero-section', 'saga-headers', 'promotional'],
    restrictions: ['Must NOT be used in navigation', 'Must NOT replace crest in functional contexts'],
  },
  'saga-fallen-queen': {
    role: 'saga-cover',
    filename: 'saga-fallen-queen.jpg',
    status: 'approved-production',
    allowedContexts: ['saga-card', 'saga-detail-header', 'chapter-thumbnails'],
  },
  'saga-ashen-blade': {
    role: 'saga-cover',
    filename: 'saga-ashen-blade.jpg',
    status: 'approved-production',
    allowedContexts: ['saga-card', 'saga-detail-header', 'chapter-thumbnails'],
  },
  'chapter-sigil': {
    role: 'chapter-thumbnail',
    filename: 'chapter-sigil.png',
    status: 'approved-production',
    allowedContexts: ['chapter-row', 'chapter-grid', 'player-thumbnail'],
    restrictions: ['Single focal object only', 'Must be readable at small size'],
  },
  'smoke-overlay': {
    role: 'atmospheric-overlay',
    filename: 'smoke-overlay.png',
    status: 'approved-production',
    allowedContexts: ['hero-section', 'page-backgrounds', 'transitions'],
  },
};

// =============================================================================
// 4. COLOR PALETTE (LOCKED)
// =============================================================================

/**
 * BLACKFEATHER uses a strictly locked color palette.
 * Do not introduce new colors without explicit approval.
 */
export const COLORS = {
  // === PRIMARY BLACKS ===
  black: {
    true: '#0B0B0B',      // True base - backgrounds
    panel: '#111111',      // Panel/card backgrounds
    card: '#141414',       // Elevated card backgrounds
  },
  
  // === CRIMSON ===
  crimson: {
    deep: '#5A0A0A',       // Deep shadows, borders
    accent: '#8B0000',     // Accent highlights
    button: '#7A0E0E',     // CTA button backgrounds
    glow: '#2B0000',       // Subtle glow effects
  },
  
  // === GOLD (PRIMARY ACCENT) ===
  gold: {
    highlight: '#D4AF37',  // Primary gold - text, borders, icons
    mid: '#B8962E',        // Mid-tone gold
    shadow: '#8C6B1F',     // Dark gold - subtle accents
  },
  
  // === ACCENTS ===
  ember: {
    primary: '#FF6A00',    // Ember particles
    light: '#FF8C42',      // Light ember glow
  },
  
  // === TEXT ===
  white: {
    text: '#EAEAEA',       // Primary text color
    dim: 'rgba(234, 234, 234, 0.6)', // Secondary/muted text
  },
  
  // === FEATHER (LOGO ELEMENT) ===
  feather: {
    base: '#1A1A1A',
    shadow: '#0B0B0B',
    highlight: '#2A2A2A',
  },
} as const;

/**
 * PROHIBITED COLORS - Never use these in BLACKFEATHER:
 * - Bright/saturated fantasy colors
 * - Modern UI blues/purples
 * - Neon or glowing colors
 * - Pure white (#FFFFFF)
 */
export const PROHIBITED_COLORS = [
  '#FFFFFF',  // Pure white
  '#0000FF',  // Blue
  '#800080',  // Purple
  '#00FF00',  // Green
  '#00FFFF',  // Cyan
  '#FF00FF',  // Magenta
];

// =============================================================================
// 5. TYPOGRAPHY RULES
// =============================================================================

export const TYPOGRAPHY = {
  // Display font - headings, titles, buttons
  display: {
    family: "'Cinzel', 'Times New Roman', serif",
    weights: [400, 500, 600, 700],
    usage: ['headings', 'titles', 'buttons', 'navigation', 'saga-titles'],
  },
  
  // Body font - paragraphs, descriptions
  body: {
    family: "'Cormorant Garamond', Georgia, serif",
    weights: [300, 400, 500],
    usage: ['body-text', 'taglines', 'descriptions', 'chapter-titles'],
  },
  
  // BLACKFEATHER wordmark specific rules
  wordmark: {
    letterSpacing: '0.2em',    // Wide tracking required
    textTransform: 'uppercase',
    background: 'linear-gradient(180deg, #D4AF37 0%, #B8962E 50%, #8C6B1F 100%)',
  },
  
  // Restrictions
  restrictions: [
    'No sans-serif in brand-critical areas',
    'Gold text only on dark backgrounds with strong contrast',
    'Never substitute with modern fonts',
  ],
} as const;

// =============================================================================
// 6. MOTION & ANIMATION RULES
// =============================================================================

export const MOTION = {
  // Allowed animations - slow, atmospheric only
  allowed: {
    emberDrift: {
      duration: '12-20s',
      easing: 'linear',
      description: 'Particles floating upward',
    },
    smokeDrift: {
      duration: '20-30s',
      easing: 'ease-in-out',
      description: 'Slow horizontal fog movement',
    },
    glowPulse: {
      duration: '5-8s',
      easing: 'ease-in-out',
      description: 'Subtle brightness/saturation breathing',
    },
    fadeIn: {
      duration: '0.8-1.2s',
      easing: 'ease-out',
      description: 'Content reveal animations',
    },
    hoverLift: {
      duration: '0.3-0.4s',
      easing: 'ease',
      description: 'Card hover elevation',
    },
  },
  
  // PROHIBITED animations
  prohibited: [
    'bounce',
    'shake',
    'spin',
    'rapid-pulse',
    'neon-glow',
    'flash',
    'slide-fast',
    'zoom-aggressive',
  ],
  
  // Core principle
  principle: 'Stillness is part of the visual identity.',
} as const;

// =============================================================================
// 7. THUMBNAIL SYSTEM RULES
// =============================================================================

export const THUMBNAIL_RULES = {
  // Default style
  default: 'sigil-based-imagery',
  
  // Requirements
  requirements: [
    'Single focal object only',
    'High contrast',
    'Centered composition',
    'Must be readable at small size (140x90px)',
  ],
  
  // Restrictions
  restrictions: [
    'No multi-object compositions',
    'No complex scenes',
    'Crown/feather/book are symbolic, not default thumbnails',
  ],
  
  // Dimensions
  dimensions: {
    standard: { width: 400, height: 225 },  // 16:9
    small: { width: 140, height: 90 },
  },
} as const;

// =============================================================================
// 8. FILE NAMING CONVENTION
// =============================================================================

/**
 * All assets must follow: blackfeather_<category>_<name>_v<version>
 * 
 * Examples:
 * - blackfeather_logo_crest_v01.png
 * - blackfeather_bg_hero-throne_v01.jpg
 * - blackfeather_saga_fallen-queen_v01.png
 */
export const FILE_NAMING = {
  prefix: 'blackfeather',
  separator: '_',
  versionFormat: 'v{XX}', // v01, v02, etc.
  
  categories: [
    'logo',
    'bg',
    'saga',
    'chapter',
    'overlay',
    'icon',
    'ui',
  ],
  
  rules: [
    'Never overwrite files without version increment',
    'Maintain historical versions',
    'Do not rename approved assets arbitrarily',
  ],
} as const;

// =============================================================================
// 9. EXPORT & VALIDATION RULES
// =============================================================================

export const EXPORT_RULES = {
  // Required validation tests before approval
  validationTests: [
    'dark-background-test',
    'small-size-readability-test',
    'mobile-crop-validation',
  ],
  
  // File type requirements
  fileTypes: {
    logos: 'png',           // Transparency required
    overlays: 'png',        // Transparency required
    backgrounds: 'jpg',     // Smaller file size
    covers: 'jpg',          // Smaller file size
  },
  
  // Quality settings
  quality: {
    jpg: 85,                // Balance quality/size
    png: 'maximum',
  },
} as const;

// =============================================================================
// 10. LOGO USAGE CONTEXTS
// =============================================================================

export const LOGO_USAGE = {
  // Clean Crest (Primary Logo)
  cleanCrest: {
    asset: 'logo-crest',
    contexts: [
      'navigation',
      'footer',
      'favicon',
      'documents',
      'small-scale-placement',
      'saga-badges',
    ],
  },
  
  // Hero / Ember Variant (Full Logo)
  heroVariant: {
    asset: 'logo-full',
    contexts: [
      'landing-page-hero',
      'saga-headers',
      'promotional-visuals',
    ],
    restrictions: [
      'Must NOT be used in navigation',
      'Must NOT be used in small UI elements',
      'Must NOT replace primary logo in functional contexts',
    ],
  },
} as const;

// =============================================================================
// 11. CHARACTER USAGE RULES
// =============================================================================

export const CHARACTER_RULES = {
  principle: 'Characters are SUPPORTING ASSETS, not brand identifiers.',
  
  requirements: [
    'Must follow BLACKFEATHER lighting and palette',
    'Must not visually overpower Crown, Crest, or core symbols',
    'Brand identity always takes precedence over character visuals',
  ],
  
  restrictions: [
    'Characters cannot replace logo elements',
    'Characters must be secondary to brand symbols in hierarchy',
  ],
} as const;

// =============================================================================
// 12. WEBSITE IMPLEMENTATION RULE
// =============================================================================

export const WEBSITE_RULES = {
  principle: 'Brand system first, narrative system second.',
  
  implications: [
    'Visual consistency overrides novelty',
    'Layout must reinforce identity',
    'Every page must feel part of the same world',
  ],
  
  requirements: [
    'Consistent color palette across all pages',
    'Consistent typography hierarchy',
    'Consistent spacing and layout patterns',
    'Consistent animation timing and style',
  ],
} as const;

// =============================================================================
// 13. ASSET STORAGE STRUCTURE
// =============================================================================

export const STORAGE_STRUCTURE = {
  folders: {
    production: '/assets/approved',
    alternates: '/assets/alternates',
    exploratory: '/assets/exploratory',
    archive: '/assets/archive',
  },
  
  rules: [
    'No mixing between folders',
    'Downloads folder is NOT a valid source of truth',
    'All production assets must be in /assets/approved',
  ],
} as const;

// =============================================================================
// 14. GENERATION DISCIPLINE
// =============================================================================

export const GENERATION_RULES = {
  prohibited: [
    'Do NOT reinterpret approved assets',
    'Do NOT "improve" finalized designs without explicit instruction',
  ],
  
  maintain: [
    'Black / Crimson / Gold palette',
    'Dark, cinematic tone',
    'Symmetry and restraint',
  ],
  
  avoid: [
    'Bright or saturated fantasy colors',
    'Playful or whimsical elements',
    'Generic medieval styling',
  ],
  
  requirement: 'All new assets must visually align with existing approved materials.',
} as const;

// =============================================================================
// 15. TRANSFER INSTRUCTION
// =============================================================================

/**
 * When continuing work in a new environment, include this instruction:
 */
export const TRANSFER_INSTRUCTION = `
BLACKFEATHER is a locked brand system. Approved assets, palette, logo hierarchy, 
and thumbnail logic are established. Do not redesign approved assets unless 
explicitly asked. Maintain black/crimson/gold palette, restrained motion, 
centered composition, and dark cinematic tone.
`;

// =============================================================================
// NON-NEGOTIABLE PRINCIPLE
// =============================================================================

/**
 * BLACKFEATHER is a LOCKED SYSTEM.
 * 
 * - Do not redesign approved elements unless explicitly directed
 * - Do not introduce conflicting styles
 * - Do not dilute the palette, tone, or structure
 * 
 * All work must reinforce the established identity.
 */
export const CORE_PRINCIPLE = 'BLACKFEATHER is a locked system. All work must reinforce the established identity.';

// =============================================================================
// 16. COMPONENT COMPLIANCE RULES
// =============================================================================

/**
 * Component-level rules that enforce structural consistency.
 * Every component must comply with these specifications.
 */
export const COMPONENT_RULES = {
  // Button specifications
  button: {
    primary: {
      background: COLORS.crimson.button,
      border: `1px solid ${COLORS.gold.highlight}`,
      color: COLORS.gold.highlight,
      paddingY: ['12px', '16px'],    // min, max
      paddingX: ['24px', '48px'],    // min, max
      fontSize: ['10px', '12px'],    // min, max
      letterSpacing: '0.15em',
      fontFamily: 'display',         // Cinzel
      textTransform: 'uppercase',
      hoverEffect: 'brighten',       // NOT bounce, NOT scale-up
    },
    outline: {
      background: 'transparent',
      border: `1px solid ${COLORS.gold.highlight}`,
      color: COLORS.gold.highlight,
      hoverEffect: 'fill-subtle',
    },
    play: {
      shape: 'circle',
      size: ['48px', '64px'],        // min, max
      background: `rgba(212, 175, 55, 0.1)`,
      border: `1px solid ${COLORS.gold.highlight}`,
      iconColor: COLORS.gold.highlight,
    },
  },
  
  // Card specifications
  card: {
    saga: {
      layout: 'horizontal',          // image left, content right
      background: COLORS.black.panel,
      border: `1px solid ${COLORS.gold.shadow}`,
      imageWidth: ['200px', '280px'],
      minHeight: '280px',
      maxElements: 6,                // badge, title, tagline, meta, cta, image
    },
    chapter: {
      layout: 'row',
      background: COLORS.black.panel,
      border: `1px solid rgba(90, 10, 10, 0.4)`,
      thumbnailWidth: ['120px', '180px'],
      thumbnailRatio: '16:9',
      maxElements: 5,                // thumb, saga-badge, title, meta, play
    },
  },
  
  // Section header specifications
  sectionHeader: {
    layout: 'center-with-lines',
    fontSize: '12px',
    letterSpacing: '0.35em',
    color: COLORS.gold.shadow,
    textTransform: 'uppercase',
    lineStyle: 'gradient-fade',
  },
  
  // Navbar specifications
  navbar: {
    position: 'fixed',
    background: 'gradient-fade-down',
    logoSize: ['32px', '40px'],      // height
    logoAsset: 'crest',              // NOT logo-full
    padding: ['1rem', '1.5rem'],
  },
} as const;

// =============================================================================
// 17. LAYOUT ENFORCEMENT RULES
// =============================================================================

/**
 * Layout rules that enforce structural integrity.
 * Validates page composition, not just individual components.
 */
export const LAYOUT_RULES = {
  // Page structure
  page: {
    maxWidth: '1400px',
    contentMaxWidth: '900px',
    minPadding: '1rem',
    background: COLORS.black.true,
  },
  
  // Hero section (CRITICAL)
  hero: {
    minHeight: '100vh',
    maxFocalElements: 1,             // Single focal point rule
    requiredLayers: ['background', 'gradient-overlay', 'content'],
    optionalLayers: ['smoke', 'embers', 'vignette'],
    contentPosition: 'center',
    backgroundAsset: 'hero',         // Must use ASSET_PATHS.hero
  },
  
  // Section spacing
  sections: {
    paddingY: ['3rem', '5rem'],      // min, max
    headerMarginBottom: '2.5rem',
  },
  
  // Stacking order (z-index)
  zIndex: {
    base: 0,
    background: 0,
    atmosphericLayers: [1, 5],       // smoke, embers, vignette
    content: 10,
    navbar: 100,
    modal: 200,
    toast: 300,
  },
  
  // Grid specifications
  grid: {
    columns: 12,
    gutter: '1.5rem',
    breakpoints: {
      mobile: '0px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1400px',
    },
  },
} as const;

// =============================================================================
// 18. SPACING SCALE (LOCKED)
// =============================================================================

/**
 * All spacing must use this scale.
 * No arbitrary values allowed.
 */
export const SPACING_SCALE = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
} as const;

export type SpacingKey = keyof typeof SPACING_SCALE;

// =============================================================================
// 19. FOCAL POINT RULES
// =============================================================================

/**
 * Single focal point rule enforcement.
 * One of BLACKFEATHER's strongest brand rules.
 */
export const FOCAL_POINT_RULES = {
  // Per-section limits
  maxDominantPerSection: 1,
  maxSupportingPerSection: 3,
  
  // Element classification
  dominant: {
    description: 'Primary visual that commands attention',
    examples: ['hero-image', 'saga-cover', 'chapter-player'],
    scale: 'largest element in section',
  },
  supporting: {
    description: 'Secondary visuals that complement dominant',
    examples: ['thumbnails', 'badges', 'icons'],
    scale: 'must be visually subordinate to dominant',
  },
  
  // Validation criteria
  criteria: {
    sizeRatio: 0.5,                  // Supporting must be ≤50% of dominant
    contrastDifference: 0.3,         // Dominant should have higher contrast
    positionPriority: 'center',      // Dominant should be centered or left
  },
} as const;

// =============================================================================
// 20. MOTION THROTTLING
// =============================================================================

/**
 * Prevents animation overload.
 * Even allowed animations can become "Vegas" when stacked.
 */
export const MOTION_LIMITS = {
  // Per-viewport limits
  maxAnimatedElementsPerScreen: 4,
  maxConcurrentAnimations: 3,
  
  // Intensity limits
  maxAnimationIntensity: 'subtle',   // subtle | moderate | (never intense)
  
  // Timing thresholds (minimum durations)
  minDurations: {
    emberDrift: 12000,               // 12s minimum
    smokeDrift: 20000,               // 20s minimum
    glowPulse: 5000,                 // 5s minimum
    fadeIn: 600,                     // 0.6s minimum
    hoverTransition: 200,            // 0.2s minimum
  },
  
  // Combined motion budget per page
  motionBudget: {
    hero: ['embers', 'smoke', 'glowPulse'],  // max 3 in hero
    cards: ['hoverLift'],                     // max 1 per card
    navigation: [],                           // no animations in nav
  },
  
  // Automatic reduction for performance
  reduceMotionBreakpoint: 768,       // Reduce on mobile
  reducedMotionSet: ['glowPulse'],   // Keep only essential
} as const;

// =============================================================================
// 21. ASSET READABILITY RULES
// =============================================================================

/**
 * Small size readability enforcement.
 * Assets must pass these tests before approval.
 */
export const READABILITY_RULES = {
  // Minimum contrast ratios
  contrast: {
    logo: 4.5,                       // WCAG AA
    text: 4.5,                       // WCAG AA
    decorative: 3.0,                 // Relaxed for non-essential
  },
  
  // Size thresholds where readability is tested
  testSizes: {
    favicon: 16,                     // px
    navLogo: 32,                     // px
    thumbnail: 90,                   // px height
    badge: 18,                       // px height
  },
  
  // Silhouette clarity (for logos/icons)
  silhouette: {
    mustBeRecognizable: true,
    maxDetailDensity: 'medium',      // low | medium | (never high at small size)
  },
  
  // Required tests before asset approval
  requiredTests: [
    'dark-background-test',
    'small-size-readability',
    'mobile-crop-validation',
    'contrast-ratio-check',
  ],
} as const;

// =============================================================================
// 22. VISUAL DENSITY RULES (RULE-302)
// =============================================================================

/**
 * Prevents visual weight overload.
 * Even approved elements can create clutter when stacked.
 */
export const VISUAL_DENSITY_RULES = {
  // Per-section limits for high-detail elements
  maxHighDetailPerSection: 2,
  
  // Element classification by visual weight
  highDetail: [
    'ornate-crest',
    'textured-background',
    'smoke-overlay',
    'ember-particles',
    'filigree-border',
    'detailed-illustration',
  ],
  
  mediumDetail: [
    'saga-cover',
    'gradient-overlay',
    'thin-gold-border',
    'chapter-thumbnail',
  ],
  
  lowDetail: [
    'solid-background',
    'simple-text',
    'icon',
    'button',
  ],
  
  // Section budgets (max total weight)
  sectionBudgets: {
    hero: {
      highDetail: 2,    // e.g., background + smoke
      mediumDetail: 2,  // e.g., gradient + border
      lowDetail: 5,     // text, buttons, etc.
    },
    sagaCard: {
      highDetail: 1,    // cover image only
      mediumDetail: 2,
      lowDetail: 4,
    },
    chapterRow: {
      highDetail: 0,    // keep rows clean
      mediumDetail: 1,  // thumbnail only
      lowDetail: 4,
    },
    navigation: {
      highDetail: 0,    // nav must be minimal
      mediumDetail: 0,
      lowDetail: 3,     // logo, text, button
    },
  },
  
  // Stacking rules
  stacking: {
    maxOverlayLayers: 3,           // e.g., bg + smoke + vignette
    maxTexturedSurfaces: 1,        // one textured element per section
    requireNegativeSpace: true,    // must have breathing room
  },
} as const;

// =============================================================================
// EXPORTS FOR TAILWIND/CSS INTEGRATION
// =============================================================================

/**
 * Use this to generate Tailwind config colors
 */
export const getTailwindColors = () => ({
  black: {
    DEFAULT: COLORS.black.true,
    true: COLORS.black.true,
    panel: COLORS.black.panel,
    card: COLORS.black.card,
  },
  crimson: {
    DEFAULT: COLORS.crimson.accent,
    deep: COLORS.crimson.deep,
    accent: COLORS.crimson.accent,
    button: COLORS.crimson.button,
    glow: COLORS.crimson.glow,
  },
  gold: {
    DEFAULT: COLORS.gold.highlight,
    highlight: COLORS.gold.highlight,
    mid: COLORS.gold.mid,
    shadow: COLORS.gold.shadow,
  },
  ember: {
    DEFAULT: COLORS.ember.primary,
    light: COLORS.ember.light,
  },
  white: {
    DEFAULT: COLORS.white.text,
    dim: COLORS.white.dim,
  },
  feather: COLORS.feather,
});

/**
 * Use this to generate CSS custom properties
 */
export const getCSSVariables = () => `
:root {
  /* Blacks */
  --black-true: ${COLORS.black.true};
  --black-panel: ${COLORS.black.panel};
  --black-card: ${COLORS.black.card};
  
  /* Crimson */
  --crimson-deep: ${COLORS.crimson.deep};
  --crimson-accent: ${COLORS.crimson.accent};
  --crimson-button: ${COLORS.crimson.button};
  --crimson-glow: ${COLORS.crimson.glow};
  
  /* Gold */
  --gold-highlight: ${COLORS.gold.highlight};
  --gold-mid: ${COLORS.gold.mid};
  --gold-shadow: ${COLORS.gold.shadow};
  
  /* Ember */
  --ember: ${COLORS.ember.primary};
  --ember-light: ${COLORS.ember.light};
  
  /* Text */
  --white-text: ${COLORS.white.text};
  --white-dim: ${COLORS.white.dim};
  
  /* Feather */
  --feather-base: ${COLORS.feather.base};
  --feather-shadow: ${COLORS.feather.shadow};
  --feather-highlight: ${COLORS.feather.highlight};
}
`;
