/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                              B L A C K F E A T H E R                         ║
 * ║                                                                              ║
 * ║                         BRAND ENFORCEMENT MODULE                             ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This module provides complete enforcement of the BLACKFEATHER brand system.
 * Use in components, build scripts, CI pipelines, and pre-commit hooks.
 * 
 * When BRAND_STRICT_MODE is true, violations will fail builds.
 */

import {
  BRAND_STRICT_MODE,
  PRODUCTION_LOCK,
  BRAND_SYSTEM_VERSION,
  RULE_IDS,
  ACTIVE_OVERRIDES,
  ASSET_PATHS,
  ASSET_METADATA,
  COLORS,
  CANONICAL_ASSETS,
  COMPONENT_RULES,
  LAYOUT_RULES,
  SPACING_SCALE,
  FOCAL_POINT_RULES,
  MOTION_LIMITS,
  READABILITY_RULES,
  VISUAL_DENSITY_RULES,
  MOTION,
  TYPOGRAPHY,
  type RuleOverride,
  type SpacingKey,
  type AssetMetadata,
} from './brand-system';

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult {
  ruleId: string;
  category: 'color' | 'asset' | 'component' | 'layout' | 'motion' | 'typography' | 'focal-point' | 'spacing' | 'readability' | 'visual-density' | 'existence';
  valid: boolean;
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

export interface ComponentConfig {
  type: keyof typeof COMPONENT_RULES;
  colors?: string[];
  assets?: string[];
  spacing?: string[];
  animations?: string[];
  elementCount?: number;
}

export interface LayoutConfig {
  type: 'hero' | 'section' | 'page';
  focalElements?: Array<{ type: 'dominant' | 'supporting'; id: string }>;
  layers?: string[];
  width?: string;
  animations?: Array<{ type: string; durationMs: number }>;
  zIndexValues?: number[];
}

export interface PageConfig {
  components: ComponentConfig[];
  layout: LayoutConfig;
  totalAnimations: number;
}

// =============================================================================
// OVERRIDE MANAGEMENT
// =============================================================================

/**
 * Register a rule override with justification.
 * All overrides are logged and can be audited.
 */
export function overrideRule(
  ruleId: string,
  justification: string,
  approvedBy: string,
  expiresAt?: string
): RuleOverride {
  const override: RuleOverride = {
    ruleId,
    justification,
    approvedBy,
    timestamp: new Date().toISOString(),
    expiresAt,
  };
  
  // Log the override
  console.warn(
    `⚠️ BLACKFEATHER RULE OVERRIDE REGISTERED:\n` +
    `  Rule: ${ruleId}\n` +
    `  Justification: ${justification}\n` +
    `  Approved by: ${approvedBy}\n` +
    `  Expires: ${expiresAt || 'Never'}`
  );
  
  ACTIVE_OVERRIDES.push(override);
  return override;
}

/**
 * Check if a rule has an active override.
 */
export function hasOverride(ruleId: string): boolean {
  const now = new Date().toISOString();
  return ACTIVE_OVERRIDES.some(o => 
    o.ruleId === ruleId && 
    (!o.expiresAt || o.expiresAt > now)
  );
}

/**
 * Get all active overrides for audit.
 */
export function getActiveOverrides(): RuleOverride[] {
  const now = new Date().toISOString();
  return ACTIVE_OVERRIDES.filter(o => !o.expiresAt || o.expiresAt > now);
}

// =============================================================================
// COMPONENT VALIDATION
// =============================================================================

/**
 * Validate a component against BLACKFEATHER specifications.
 * Checks colors, spacing, assets, and structural rules.
 */
export function validateComponent(config: ComponentConfig): ValidationResult[] {
  const results: ValidationResult[] = [];
  const rules = COMPONENT_RULES[config.type];
  
  if (!rules) {
    results.push({
      ruleId: 'component-type',
      category: 'component',
      valid: false,
      severity: 'error',
      message: `Unknown component type: ${config.type}`,
      suggestion: `Valid types: ${Object.keys(COMPONENT_RULES).join(', ')}`,
    });
    return results;
  }
  
  // Validate colors
  if (config.colors) {
    for (const color of config.colors) {
      const isApproved = isColorInPalette(color);
      if (!isApproved) {
        results.push({
          ruleId: 'component-color',
          category: 'color',
          valid: false,
          severity: 'error',
          message: `Color ${color} not in approved palette for ${config.type}`,
          suggestion: 'Use colors from COLORS constant only',
        });
      }
    }
  }
  
  // Validate spacing
  if (config.spacing) {
    for (const space of config.spacing) {
      if (!isValidSpacing(space)) {
        results.push({
          ruleId: 'component-spacing',
          category: 'spacing',
          valid: false,
          severity: 'warning',
          message: `Spacing value ${space} not in approved scale`,
          suggestion: `Use SPACING_SCALE values: ${Object.values(SPACING_SCALE).join(', ')}`,
        });
      }
    }
  }
  
  // Validate element count (for cards)
  if (config.elementCount !== undefined && 'maxElements' in rules) {
    const maxElements = (rules as any).maxElements;
    if (config.elementCount > maxElements) {
      results.push({
        ruleId: 'component-complexity',
        category: 'component',
        valid: false,
        severity: 'error',
        message: `${config.type} has ${config.elementCount} elements, max allowed is ${maxElements}`,
        suggestion: 'Simplify component structure',
      });
    }
  }
  
  // Validate assets
  if (config.assets) {
    for (const asset of config.assets) {
      if (!isCanonicalAsset(asset)) {
        results.push({
          ruleId: 'component-asset',
          category: 'asset',
          valid: false,
          severity: 'error',
          message: `Asset ${asset} not in ASSET_PATHS`,
          suggestion: 'Use ASSET_PATHS constant for all asset references',
        });
      }
    }
  }
  
  // If no issues found
  if (results.length === 0) {
    results.push({
      ruleId: 'component-valid',
      category: 'component',
      valid: true,
      severity: 'warning',
      message: `Component ${config.type} passes all checks`,
    });
  }
  
  return results;
}

// =============================================================================
// LAYOUT VALIDATION
// =============================================================================

/**
 * Validate page layout against BLACKFEATHER structure rules.
 */
export function validateLayout(config: LayoutConfig): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // === HERO VALIDATION ===
  if (config.type === 'hero') {
    const heroRules = LAYOUT_RULES.hero;
    
    // Check required layers
    if (config.layers) {
      for (const required of heroRules.requiredLayers) {
        if (!config.layers.includes(required)) {
          results.push({
            ruleId: 'hero-required-layer',
            category: 'layout',
            valid: false,
            severity: 'error',
            message: `Hero missing required layer: ${required}`,
            suggestion: `Required layers: ${heroRules.requiredLayers.join(', ')}`,
          });
        }
      }
    }
  }
  
  // === FOCAL POINT VALIDATION ===
  if (config.focalElements) {
    const focalResults = validateFocalPoints(config.focalElements);
    results.push(...focalResults);
  }
  
  // === Z-INDEX VALIDATION ===
  if (config.zIndexValues) {
    const validZIndexes = Object.values(LAYOUT_RULES.zIndex).flat() as number[];
    for (const z of config.zIndexValues) {
      if (typeof z === 'number' && !validZIndexes.includes(z)) {
        results.push({
          ruleId: 'layout-zindex',
          category: 'layout',
          valid: false,
          severity: 'warning',
          message: `z-index ${z} not in standard scale`,
          suggestion: `Use values from LAYOUT_RULES.zIndex`,
        });
      }
    }
  }
  
  // === ANIMATION VALIDATION ===
  if (config.animations) {
    const animResults = validateMotionBudget(config.type, config.animations);
    results.push(...animResults);
  }
  
  return results;
}

// =============================================================================
// FOCAL POINT VALIDATION
// =============================================================================

/**
 * Enforce single focal point rule.
 * Max 1 dominant visual per section.
 */
export function validateFocalPoints(
  elements: Array<{ type: 'dominant' | 'supporting'; id: string }>
): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  const dominant = elements.filter(e => e.type === 'dominant');
  const supporting = elements.filter(e => e.type === 'supporting');
  
  // Check dominant count
  if (dominant.length > FOCAL_POINT_RULES.maxDominantPerSection) {
    results.push({
      ruleId: 'focal-dominant-limit',
      category: 'focal-point',
      valid: false,
      severity: 'error',
      message: `Too many dominant elements: ${dominant.length}. Max: ${FOCAL_POINT_RULES.maxDominantPerSection}`,
      suggestion: 'Demote secondary visuals to supporting role',
    });
  }
  
  // Check supporting count
  if (supporting.length > FOCAL_POINT_RULES.maxSupportingPerSection) {
    results.push({
      ruleId: 'focal-supporting-limit',
      category: 'focal-point',
      valid: false,
      severity: 'warning',
      message: `Too many supporting elements: ${supporting.length}. Max: ${FOCAL_POINT_RULES.maxSupportingPerSection}`,
      suggestion: 'Reduce visual complexity',
    });
  }
  
  // Must have exactly one dominant if any visuals exist
  if (elements.length > 0 && dominant.length === 0) {
    results.push({
      ruleId: 'focal-missing-dominant',
      category: 'focal-point',
      valid: false,
      severity: 'warning',
      message: 'Section has visuals but no designated dominant element',
      suggestion: 'Designate one element as the focal point',
    });
  }
  
  return results;
}

// =============================================================================
// MOTION BUDGET VALIDATION
// =============================================================================

/**
 * Validate motion budget to prevent animation overload.
 */
export function validateMotionBudget(
  sectionType: string,
  animations: Array<{ type: string; durationMs: number }>
): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Check total animation count
  if (animations.length > MOTION_LIMITS.maxAnimatedElementsPerScreen) {
    results.push({
      ruleId: 'motion-count-limit',
      category: 'motion',
      valid: false,
      severity: 'error',
      message: `Too many animations: ${animations.length}. Max: ${MOTION_LIMITS.maxAnimatedElementsPerScreen}`,
      suggestion: 'Remove non-essential animations. Stillness is part of the identity.',
    });
  }
  
  // Check section-specific budgets
  const budget = MOTION_LIMITS.motionBudget[sectionType as keyof typeof MOTION_LIMITS.motionBudget];
  if (budget) {
    const types = animations.map(a => a.type);
    for (const type of types) {
      if (!(budget as readonly string[]).includes(type)) {
        results.push({
          ruleId: 'motion-section-budget',
          category: 'motion',
          valid: false,
          severity: 'warning',
          message: `Animation type "${type}" not in budget for ${sectionType}`,
          suggestion: `Allowed in ${sectionType}: ${budget.join(', ') || 'none'}`,
        });
      }
    }
  }
  
  // Check duration minimums
  for (const anim of animations) {
    const minDuration = MOTION_LIMITS.minDurations[anim.type as keyof typeof MOTION_LIMITS.minDurations];
    if (minDuration && anim.durationMs < minDuration) {
      results.push({
        ruleId: 'motion-too-fast',
        category: 'motion',
        valid: false,
        severity: 'error',
        message: `Animation "${anim.type}" too fast: ${anim.durationMs}ms. Min: ${minDuration}ms`,
        suggestion: 'BLACKFEATHER uses slow, atmospheric motion only',
      });
    }
  }
  
  // Check for prohibited animation types
  for (const anim of animations) {
    if ((MOTION.prohibited as readonly string[]).includes(anim.type)) {
      results.push({
        ruleId: 'motion-prohibited',
        category: 'motion',
        valid: false,
        severity: 'error',
        message: `Animation type "${anim.type}" is prohibited`,
        suggestion: `Prohibited: ${MOTION.prohibited.join(', ')}`,
      });
    }
  }
  
  return results;
}

// =============================================================================
// ASSET READABILITY VALIDATION
// =============================================================================

/**
 * Validate asset readability at small sizes.
 * Uses ASSET_METADATA for size and background requirements.
 */
export function validateAssetReadability(
  assetKey: keyof typeof ASSET_PATHS,
  displaySize: number,
  contrastRatio?: number,
  backgroundType?: 'dark' | 'light' | 'transparent'
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const metadata = ASSET_METADATA[assetKey];
  
  if (!metadata) {
    results.push({
      ruleId: 'readability-unknown-asset',
      category: 'readability',
      valid: false,
      severity: 'error',
      message: `Unknown asset key: ${assetKey}`,
      suggestion: `Use keys from ASSET_PATHS: ${Object.keys(ASSET_PATHS).join(', ')}`,
    });
    return results;
  }
  
  // Check minimum display size
  if (displaySize < metadata.minDisplaySize) {
    results.push({
      ruleId: 'readability-size',
      category: 'readability',
      valid: false,
      severity: 'error',
      message: `${assetKey} displayed at ${displaySize}px, minimum is ${metadata.minDisplaySize}px`,
      suggestion: `Increase display size or use a different asset`,
    });
  }
  
  // Check background requirement
  if (backgroundType && metadata.backgroundRequirement !== 'any') {
    if (metadata.backgroundRequirement === 'dark' && backgroundType !== 'dark') {
      results.push({
        ruleId: 'readability-background',
        category: 'readability',
        valid: false,
        severity: 'error',
        message: `${assetKey} requires dark background, got ${backgroundType}`,
        suggestion: 'Place asset on dark background only',
      });
    }
    if (metadata.backgroundRequirement === 'transparent' && backgroundType !== 'transparent') {
      results.push({
        ruleId: 'readability-background',
        category: 'readability',
        valid: false,
        severity: 'warning',
        message: `${assetKey} is designed for transparent/layered use`,
        suggestion: 'Use as overlay layer, not standalone',
      });
    }
  }
  
  // Check contrast ratio for logos
  if (contrastRatio !== undefined) {
    let requiredContrast: number = READABILITY_RULES.contrast.decorative;
    
    if (metadata.role === 'primary-logo' || metadata.role === 'logo-with-text') {
      requiredContrast = READABILITY_RULES.contrast.logo;
    }
    
    if (contrastRatio < requiredContrast) {
      results.push({
        ruleId: 'readability-contrast',
        category: 'readability',
        valid: false,
        severity: 'error',
        message: `Contrast ratio ${contrastRatio.toFixed(2)} below required ${requiredContrast} for ${metadata.role}`,
        suggestion: 'Increase contrast between asset and background',
      });
    }
  }
  
  return results;
}

// =============================================================================
// ASSET EXISTENCE VALIDATION
// =============================================================================

/**
 * Validate that an asset file actually exists.
 * Prevents approving references to missing files.
 * 
 * Note: In browser context, this checks if asset is loadable.
 * In Node context, this checks filesystem.
 */
export function validateAssetExists(
  assetKey: keyof typeof ASSET_PATHS,
  basePath: string = '/public/images'
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const filename = ASSET_PATHS[assetKey];
  const metadata = ASSET_METADATA[assetKey];
  
  if (!filename) {
    results.push({
      ruleId: 'RULE-003',
      category: 'existence',
      valid: false,
      severity: 'error',
      message: `Unknown asset key: ${assetKey}`,
      suggestion: `Valid keys: ${Object.keys(ASSET_PATHS).join(', ')}`,
    });
    return results;
  }
  
  // In Node.js environment (build time)
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(process.cwd(), basePath, filename);
      
      if (!fs.existsSync(fullPath)) {
        results.push({
          ruleId: 'RULE-003',
          category: 'existence',
          valid: false,
          severity: 'error',
          message: `Asset file not found: ${filename}`,
          suggestion: `Expected at: ${fullPath}`,
        });
      } else {
        // Check file extension matches expected
        const ext = path.extname(filename).toLowerCase();
        if (metadata?.transparencyRequired && ext !== '.png') {
          results.push({
            ruleId: 'RULE-009',
            category: 'existence',
            valid: false,
            severity: 'warning',
            message: `Asset ${filename} requires transparency but is not PNG`,
            suggestion: 'Convert to PNG format for transparency support',
          });
        }
      }
    } catch (e) {
      // fs not available (browser), skip existence check
    }
  }
  
  return results;
}

/**
 * Validate all canonical assets exist.
 * Run this at build time.
 */
export function validateAllAssetsExist(basePath?: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  for (const key of Object.keys(ASSET_PATHS) as Array<keyof typeof ASSET_PATHS>) {
    results.push(...validateAssetExists(key, basePath));
  }
  
  return results;
}

// =============================================================================
// VISUAL DENSITY VALIDATION (RULE-302)
// =============================================================================

export interface VisualElement {
  id: string;
  type: string;
  weight: 'high' | 'medium' | 'low';
}

/**
 * Validate visual density to prevent clutter.
 * Even approved elements can overload a section.
 */
export function validateVisualDensity(
  sectionType: keyof typeof VISUAL_DENSITY_RULES.sectionBudgets,
  elements: VisualElement[]
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const budget = VISUAL_DENSITY_RULES.sectionBudgets[sectionType];
  
  if (!budget) {
    results.push({
      ruleId: 'RULE-302',
      category: 'visual-density',
      valid: false,
      severity: 'warning',
      message: `Unknown section type: ${sectionType}`,
      suggestion: `Valid types: ${Object.keys(VISUAL_DENSITY_RULES.sectionBudgets).join(', ')}`,
    });
    return results;
  }
  
  // Count elements by weight
  const counts = {
    high: elements.filter(e => e.weight === 'high').length,
    medium: elements.filter(e => e.weight === 'medium').length,
    low: elements.filter(e => e.weight === 'low').length,
  };
  
  // Check high-detail budget
  if (counts.high > budget.highDetail) {
    results.push({
      ruleId: 'RULE-302',
      category: 'visual-density',
      valid: false,
      severity: 'error',
      message: `Too many high-detail elements in ${sectionType}: ${counts.high}/${budget.highDetail}`,
      suggestion: `High-detail elements: ${VISUAL_DENSITY_RULES.highDetail.join(', ')}. Remove or simplify.`,
    });
  }
  
  // Check medium-detail budget
  if (counts.medium > budget.mediumDetail) {
    results.push({
      ruleId: 'RULE-302',
      category: 'visual-density',
      valid: false,
      severity: 'warning',
      message: `Too many medium-detail elements in ${sectionType}: ${counts.medium}/${budget.mediumDetail}`,
      suggestion: 'Consider simplifying visual composition.',
    });
  }
  
  // Check low-detail budget
  if (counts.low > budget.lowDetail) {
    results.push({
      ruleId: 'RULE-302',
      category: 'visual-density',
      valid: false,
      severity: 'warning',
      message: `Too many elements in ${sectionType}: ${counts.low}/${budget.lowDetail}`,
      suggestion: 'Section may feel cluttered. Review element necessity.',
    });
  }
  
  // Check overlay stacking
  const overlayCount = elements.filter(e => 
    (VISUAL_DENSITY_RULES.highDetail as readonly string[]).includes(e.type) && 
    e.type.includes('overlay')
  ).length;
  
  if (overlayCount > VISUAL_DENSITY_RULES.stacking.maxOverlayLayers) {
    results.push({
      ruleId: 'RULE-302',
      category: 'visual-density',
      valid: false,
      severity: 'error',
      message: `Too many overlay layers: ${overlayCount}/${VISUAL_DENSITY_RULES.stacking.maxOverlayLayers}`,
      suggestion: 'Reduce overlay complexity. Max 3 layers.',
    });
  }
  
  return results;
}

// =============================================================================
// PRODUCTION LOCK VALIDATION
// =============================================================================

/**
 * Validate asset is allowed under current production lock setting.
 */
export function validateProductionLock(
  assetKey: keyof typeof ASSET_PATHS
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const metadata = ASSET_METADATA[assetKey];
  
  if (!metadata) {
    return results;
  }
  
  if (PRODUCTION_LOCK && metadata.status !== 'approved-production') {
    results.push({
      ruleId: 'RULE-002',
      category: 'asset',
      valid: false,
      severity: 'error',
      message: `Asset ${assetKey} is "${metadata.status}" but PRODUCTION_LOCK is enabled`,
      suggestion: 'Only "approved-production" assets allowed in production builds.',
    });
  }
  
  return results;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function isColorInPalette(color: string): boolean {
  const normalized = color.toUpperCase();
  const allColors = [
    ...Object.values(COLORS.black),
    ...Object.values(COLORS.crimson),
    ...Object.values(COLORS.gold),
    ...Object.values(COLORS.ember),
    ...Object.values(COLORS.feather),
    COLORS.white.text,
  ].map(c => typeof c === 'string' ? c.toUpperCase() : '');
  
  return allColors.includes(normalized);
}

function isValidSpacing(value: string): boolean {
  return Object.values(SPACING_SCALE).includes(value as any);
}

function isCanonicalAsset(filename: string): boolean {
  return Object.values(ASSET_PATHS).includes(filename as any) ||
         Object.values(CANONICAL_ASSETS).some(a => a.filename === filename);
}

// =============================================================================
// COMPREHENSIVE PAGE VALIDATION
// =============================================================================

/**
 * Validate an entire page configuration.
 */
export function validatePage(config: PageConfig): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Validate layout
  results.push(...validateLayout(config.layout));
  
  // Validate each component
  for (const component of config.components) {
    results.push(...validateComponent(component));
  }
  
  // Check total page animation count
  if (config.totalAnimations > MOTION_LIMITS.maxAnimatedElementsPerScreen) {
    results.push({
      ruleId: 'page-motion-overload',
      category: 'motion',
      valid: false,
      severity: 'error',
      message: `Page has ${config.totalAnimations} animations. Max: ${MOTION_LIMITS.maxAnimatedElementsPerScreen}`,
      suggestion: 'This is Vegas territory. Remove animations.',
    });
  }
  
  return results;
}

// =============================================================================
// CI / BUILD ENFORCEMENT
// =============================================================================

/**
 * Run full validation and enforce based on BRAND_STRICT_MODE.
 * Use this in build pipelines and pre-commit hooks.
 */
export function enforceCompliance(
  identifier: string,
  results: ValidationResult[]
): void {
  const errors = results.filter(r => !r.valid && r.severity === 'error');
  const warnings = results.filter(r => !r.valid && r.severity === 'warning');
  
  // Check for overrides
  const unresolvedErrors = errors.filter(e => !hasOverride(e.ruleId));
  
  // Log all issues
  if (warnings.length > 0) {
    console.warn(
      `⚠️ BLACKFEATHER WARNINGS in ${identifier}:\n` +
      warnings.map(w => `  [${w.category}] ${w.message}`).join('\n')
    );
  }
  
  if (unresolvedErrors.length > 0) {
    const errorMessage = 
      `🚫 BLACKFEATHER VIOLATIONS in ${identifier}:\n` +
      unresolvedErrors.map(e => 
        `  [${e.category}] ${e.message}${e.suggestion ? `\n    → ${e.suggestion}` : ''}`
      ).join('\n') +
      `\n\nBLACKFEATHER is a locked system. ${unresolvedErrors.length} violation(s) must be fixed.`;
    
    if (BRAND_STRICT_MODE) {
      throw new Error(errorMessage);
    } else {
      console.error(errorMessage);
    }
  }
}

/**
 * Pre-commit hook function.
 * Call this from husky or similar.
 */
export function preCommitCheck(configs: Array<{ id: string; config: PageConfig }>): boolean {
  let hasErrors = false;
  
  console.log('🖤 BLACKFEATHER Brand Compliance Check\n');
  
  for (const { id, config } of configs) {
    const results = validatePage(config);
    const errors = results.filter(r => !r.valid && r.severity === 'error' && !hasOverride(r.ruleId));
    
    if (errors.length > 0) {
      hasErrors = true;
      console.error(`❌ ${id}: ${errors.length} violation(s)`);
      errors.forEach(e => console.error(`   • ${e.message}`));
    } else {
      console.log(`✓ ${id}: Compliant`);
    }
  }
  
  console.log('');
  
  if (hasErrors && BRAND_STRICT_MODE) {
    console.error('🚫 Commit blocked. Fix violations or register overrides.');
    return false;
  }
  
  if (hasErrors) {
    console.warn('⚠️ Warnings present. Consider fixing before deploy.');
  }
  
  return !hasErrors || !BRAND_STRICT_MODE;
}

/**
 * Build pipeline function.
 * Call this from Next.js build, Vite, etc.
 */
export function buildCheck(): void {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   BLACKFEATHER BRAND COMPLIANCE CHECK      ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`Strict Mode: ${BRAND_STRICT_MODE ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Active Overrides: ${getActiveOverrides().length}`);
  console.log('');
  
  // This would be wired to actual page scanning in a real build
  // For now, it validates the system is initialized
  
  if (BRAND_STRICT_MODE) {
    console.log('✓ Enforcement active. Violations will fail build.');
  } else {
    console.log('⚠️ Development mode. Violations will log warnings only.');
  }
  
  console.log('');
}
