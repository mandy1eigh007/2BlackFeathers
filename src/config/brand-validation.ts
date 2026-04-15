/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                              B L A C K F E A T H E R                         ║
 * ║                                                                              ║
 * ║                         BRAND VALIDATION UTILITIES                           ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Runtime and build-time validation utilities to enforce brand system compliance.
 * Import these in components, build scripts, and tests to prevent drift.
 */

import {
  COLORS,
  PROHIBITED_COLORS,
  CANONICAL_ASSETS,
  MOTION,
  LOGO_USAGE,
  THUMBNAIL_RULES,
  TYPOGRAPHY,
  type AssetStatus,
  type AssetRole,
  type CanonicalAsset,
} from './brand-system';

// =============================================================================
// COLOR VALIDATION
// =============================================================================

/**
 * Check if a color is within the approved BLACKFEATHER palette
 */
export function isApprovedColor(hex: string): boolean {
  const normalizedHex = hex.toUpperCase();
  
  // Check if it's explicitly prohibited
  if (PROHIBITED_COLORS.includes(normalizedHex)) {
    return false;
  }
  
  // Flatten all approved colors for checking
  const approvedColors = [
    ...Object.values(COLORS.black),
    ...Object.values(COLORS.crimson),
    ...Object.values(COLORS.gold),
    ...Object.values(COLORS.ember),
    ...Object.values(COLORS.feather),
    COLORS.white.text,
  ].map(c => typeof c === 'string' ? c.toUpperCase() : '');
  
  return approvedColors.includes(normalizedHex);
}

/**
 * Validate a color and return detailed feedback
 */
export function validateColor(hex: string): { valid: boolean; message: string } {
  const normalizedHex = hex.toUpperCase();
  
  if (PROHIBITED_COLORS.includes(normalizedHex)) {
    return {
      valid: false,
      message: `PROHIBITED: ${hex} is explicitly banned from BLACKFEATHER. Use approved palette only.`,
    };
  }
  
  if (!isApprovedColor(hex)) {
    return {
      valid: false,
      message: `UNAPPROVED: ${hex} is not in the locked palette. Check COLORS in brand-system.ts.`,
    };
  }
  
  return { valid: true, message: 'Color approved.' };
}

// =============================================================================
// ASSET VALIDATION
// =============================================================================

/**
 * Get asset configuration by filename or key
 */
export function getAsset(identifier: string): CanonicalAsset | null {
  // Check by key first
  if (CANONICAL_ASSETS[identifier]) {
    return CANONICAL_ASSETS[identifier];
  }
  
  // Check by filename
  const entry = Object.entries(CANONICAL_ASSETS).find(
    ([_, asset]) => asset.filename === identifier
  );
  
  return entry ? entry[1] : null;
}

/**
 * Check if an asset can be used in a specific context
 */
export function canUseAssetInContext(
  assetIdentifier: string,
  context: string
): { allowed: boolean; reason: string } {
  const asset = getAsset(assetIdentifier);
  
  if (!asset) {
    return {
      allowed: false,
      reason: `Asset "${assetIdentifier}" not found in canonical assets. May be exploratory only.`,
    };
  }
  
  if (asset.status !== 'approved-production' && asset.status !== 'approved-alternate') {
    return {
      allowed: false,
      reason: `Asset "${assetIdentifier}" is not approved for production use.`,
    };
  }
  
  if (!asset.allowedContexts.includes(context)) {
    return {
      allowed: false,
      reason: `Asset "${assetIdentifier}" is not approved for context "${context}". Allowed: ${asset.allowedContexts.join(', ')}`,
    };
  }
  
  return { allowed: true, reason: 'Asset approved for this context.' };
}

/**
 * Get the correct logo asset for a given context
 */
export function getLogoForContext(context: string): string {
  // Check if context requires clean crest
  if ((LOGO_USAGE.cleanCrest.contexts as readonly string[]).includes(context)) {
    return LOGO_USAGE.cleanCrest.asset;
  }
  
  // Check if context allows hero variant
  if ((LOGO_USAGE.heroVariant.contexts as readonly string[]).includes(context)) {
    return LOGO_USAGE.heroVariant.asset;
  }
  
  // Default to clean crest for unknown contexts
  console.warn(`Unknown logo context: "${context}". Defaulting to clean crest.`);
  return LOGO_USAGE.cleanCrest.asset;
}

// =============================================================================
// MOTION VALIDATION
// =============================================================================

/**
 * Check if an animation type is allowed
 */
export function isAnimationAllowed(animationName: string): boolean {
  const prohibited = MOTION.prohibited.map(p => p.toLowerCase());
  return !prohibited.includes(animationName.toLowerCase());
}

/**
 * Validate animation duration is within BLACKFEATHER's slow, atmospheric range
 */
export function validateAnimationDuration(
  type: keyof typeof MOTION.allowed,
  durationMs: number
): { valid: boolean; message: string } {
  const config = MOTION.allowed[type];
  if (!config) {
    return { valid: false, message: `Unknown animation type: ${type}` };
  }
  
  // Parse duration range (e.g., "12-20s" -> [12000, 20000])
  const [minStr, maxStr] = config.duration.replace('s', '').split('-');
  const minMs = parseFloat(minStr) * 1000;
  const maxMs = parseFloat(maxStr) * 1000;
  
  if (durationMs < minMs) {
    return {
      valid: false,
      message: `Animation too fast. ${type} should be ${config.duration}. Got ${durationMs}ms.`,
    };
  }
  
  if (durationMs > maxMs * 1.5) { // Allow some flexibility on slow end
    return {
      valid: false,
      message: `Animation too slow. ${type} should be ${config.duration}. Got ${durationMs}ms.`,
    };
  }
  
  return { valid: true, message: 'Animation timing approved.' };
}

// =============================================================================
// TYPOGRAPHY VALIDATION
// =============================================================================

/**
 * Check if a font family is approved for brand-critical areas
 */
export function isApprovedFont(fontFamily: string): boolean {
  const approved = [
    'cinzel',
    'cormorant garamond',
    'cormorant',
    'times new roman',
    'georgia',
    'serif',
  ];
  
  const normalized = fontFamily.toLowerCase().replace(/['"]/g, '');
  return approved.some(f => normalized.includes(f));
}

/**
 * Validate font usage in a specific context
 */
export function validateFontUsage(
  fontFamily: string,
  context: 'display' | 'body'
): { valid: boolean; message: string } {
  const config = TYPOGRAPHY[context];
  
  if (!config.family.toLowerCase().includes(fontFamily.toLowerCase().replace(/['"]/g, ''))) {
    // Check if it's at least a serif
    if (!isApprovedFont(fontFamily)) {
      return {
        valid: false,
        message: `Font "${fontFamily}" not approved for ${context}. Use ${config.family}.`,
      };
    }
  }
  
  return { valid: true, message: 'Font approved.' };
}

// =============================================================================
// THUMBNAIL VALIDATION
// =============================================================================

/**
 * Validate thumbnail dimensions
 */
export function validateThumbnailDimensions(
  width: number,
  height: number
): { valid: boolean; message: string } {
  const { standard, small } = THUMBNAIL_RULES.dimensions;
  
  // Check aspect ratio (16:9)
  const expectedRatio = standard.width / standard.height;
  const actualRatio = width / height;
  const tolerance = 0.05;
  
  if (Math.abs(actualRatio - expectedRatio) > tolerance) {
    return {
      valid: false,
      message: `Thumbnail aspect ratio incorrect. Expected ~16:9, got ${actualRatio.toFixed(2)}:1`,
    };
  }
  
  // Check minimum size
  if (width < small.width || height < small.height) {
    return {
      valid: false,
      message: `Thumbnail too small. Minimum ${small.width}x${small.height}px.`,
    };
  }
  
  return { valid: true, message: 'Thumbnail dimensions approved.' };
}

// =============================================================================
// COMPREHENSIVE VALIDATION
// =============================================================================

export interface ValidationResult {
  category: string;
  valid: boolean;
  message: string;
}

/**
 * Run all validations on a component/page configuration
 */
export function validateBrandCompliance(config: {
  colors?: string[];
  assets?: Array<{ identifier: string; context: string }>;
  animations?: Array<{ type: string; durationMs: number }>;
  fonts?: Array<{ family: string; context: 'display' | 'body' }>;
}): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Validate colors
  if (config.colors) {
    for (const color of config.colors) {
      const validation = validateColor(color);
      results.push({
        category: 'color',
        valid: validation.valid,
        message: validation.message,
      });
    }
  }
  
  // Validate assets
  if (config.assets) {
    for (const { identifier, context } of config.assets) {
      const validation = canUseAssetInContext(identifier, context);
      results.push({
        category: 'asset',
        valid: validation.allowed,
        message: validation.reason,
      });
    }
  }
  
  // Validate animations
  if (config.animations) {
    for (const { type, durationMs } of config.animations) {
      if (!isAnimationAllowed(type)) {
        results.push({
          category: 'animation',
          valid: false,
          message: `Animation type "${type}" is prohibited.`,
        });
      } else if (type in MOTION.allowed) {
        const validation = validateAnimationDuration(
          type as keyof typeof MOTION.allowed,
          durationMs
        );
        results.push({
          category: 'animation',
          valid: validation.valid,
          message: validation.message,
        });
      }
    }
  }
  
  // Validate fonts
  if (config.fonts) {
    for (const { family, context } of config.fonts) {
      const validation = validateFontUsage(family, context);
      results.push({
        category: 'typography',
        valid: validation.valid,
        message: validation.message,
      });
    }
  }
  
  return results;
}

/**
 * Quick check if all validations pass
 */
export function isFullyCompliant(results: ValidationResult[]): boolean {
  return results.every(r => r.valid);
}

/**
 * Get only failed validations
 */
export function getViolations(results: ValidationResult[]): ValidationResult[] {
  return results.filter(r => !r.valid);
}

// =============================================================================
// DEV/BUILD HELPERS
// =============================================================================

/**
 * Console warning helper for development
 */
export function warnIfNonCompliant(
  component: string,
  results: ValidationResult[]
): void {
  const violations = getViolations(results);
  
  if (violations.length > 0) {
    console.warn(
      `⚠️ BLACKFEATHER BRAND VIOLATION in ${component}:\n` +
      violations.map(v => `  [${v.category}] ${v.message}`).join('\n')
    );
  }
}

/**
 * Throw error on violations (for strict build enforcement)
 */
export function enforceCompliance(
  component: string,
  results: ValidationResult[]
): void {
  const violations = getViolations(results);
  
  if (violations.length > 0) {
    throw new Error(
      `BLACKFEATHER BRAND SYSTEM VIOLATION in ${component}:\n` +
      violations.map(v => `  [${v.category}] ${v.message}`).join('\n') +
      '\n\nBLACKFEATHER is a locked system. Fix violations before proceeding.'
    );
  }
}
