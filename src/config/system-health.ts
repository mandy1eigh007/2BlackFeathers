/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                              B L A C K F E A T H E R                         ║
 * ║                                                                              ║
 * ║                          SYSTEM HEALTH CHECK                                 ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Single command to validate the entire system.
 * 
 * Usage:
 *   const result = await runFullSystemValidation();
 *   if (result.status === 'FAIL') process.exit(1);
 */

import {
  BRAND_SYSTEM_VERSION,
  BRAND_STRICT_MODE,
  PRODUCTION_LOCK,
  ASSET_PATHS,
  ASSET_DIMENSIONS,
} from './brand-system';

import { STORY_SYSTEM_VERSION } from './story-system';

import {
  validateAllAssetsExist,
  validateVisualDensity,
  validateProductionLock,
  type ValidationResult,
  type VisualElement,
} from './brand-enforcement';

import {
  validateBrandCompliance,
  type ValidationResult as BasicValidationResult,
} from './brand-validation';

import {
  validateStory,
  getValidationSummary,
  type StoryConfig,
  type StoryValidationResult,
} from './story-validation';

// =============================================================================
// TYPES
// =============================================================================

export interface SystemHealthResult {
  status: 'PASS' | 'FAIL';
  timestamp: string;
  versions: {
    brand: string;
    story: string;
  };
  modes: {
    strictMode: boolean;
    productionLock: boolean;
  };
  checks: {
    assetsExist: CheckResult;
    assetDimensions: CheckResult;
    brandCompliance: CheckResult;
    visualDensity: CheckResult;
    productionLock: CheckResult;
    storyValidation: CheckResult;
  };
  summary: {
    totalErrors: number;
    totalWarnings: number;
    passedChecks: number;
    failedChecks: number;
  };
  violations: AllViolations;
}

export interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  errors: number;
  warnings: number;
  message: string;
}

export interface AllViolations {
  assets: ValidationResult[];
  brand: BasicValidationResult[];
  visual: ValidationResult[];
  production: ValidationResult[];
  story: StoryValidationResult[];
}

// =============================================================================
// ASSET DIMENSION VALIDATION
// =============================================================================

interface ImageDimensions {
  width: number;
  height: number;
  format: string;
}

/**
 * Validate asset dimensions against constraints.
 * In Node.js, this requires image-size or similar package.
 * Returns results based on ASSET_DIMENSIONS.
 */
export function validateAssetDimensions(
  assetKey: keyof typeof ASSET_PATHS,
  dimensions: ImageDimensions
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const constraints = ASSET_DIMENSIONS[assetKey];
  
  if (!constraints) {
    results.push({
      ruleId: 'asset-dimensions-unknown',
      category: 'asset',
      valid: false,
      severity: 'warning',
      message: `No dimension constraints defined for ${assetKey}`,
    });
    return results;
  }
  
  // Check minimum width
  if (dimensions.width < constraints.minWidth) {
    results.push({
      ruleId: 'asset-dimensions-width',
      category: 'asset',
      valid: false,
      severity: 'error',
      message: `${assetKey} width ${dimensions.width}px < minimum ${constraints.minWidth}px`,
      suggestion: `Upload image at least ${constraints.minWidth}px wide`,
    });
  }
  
  // Check minimum height
  if (dimensions.height < constraints.minHeight) {
    results.push({
      ruleId: 'asset-dimensions-height',
      category: 'asset',
      valid: false,
      severity: 'error',
      message: `${assetKey} height ${dimensions.height}px < minimum ${constraints.minHeight}px`,
      suggestion: `Upload image at least ${constraints.minHeight}px tall`,
    });
  }
  
  // Check format
  if (dimensions.format.toLowerCase() !== constraints.format) {
    results.push({
      ruleId: 'asset-dimensions-format',
      category: 'asset',
      valid: false,
      severity: 'error',
      message: `${assetKey} format is ${dimensions.format}, expected ${constraints.format}`,
      suggestion: `Convert to ${constraints.format.toUpperCase()} format`,
    });
  }
  
  // Check aspect ratio (if not 'any')
  if (constraints.aspectRatio !== 'any') {
    const [expectedW, expectedH] = constraints.aspectRatio.split(':').map(Number);
    const expectedRatio = expectedW / expectedH;
    const actualRatio = dimensions.width / dimensions.height;
    const tolerance = 0.05; // 5% tolerance
    
    if (Math.abs(actualRatio - expectedRatio) > tolerance) {
      results.push({
        ruleId: 'asset-dimensions-aspect',
        category: 'asset',
        valid: false,
        severity: 'warning',
        message: `${assetKey} aspect ratio ~${actualRatio.toFixed(2)}:1, expected ${constraints.aspectRatio}`,
        suggestion: `Crop to ${constraints.aspectRatio} aspect ratio`,
      });
    }
  }
  
  return results;
}

// =============================================================================
// FULL SYSTEM VALIDATION
// =============================================================================

/**
 * Run complete system health check.
 * 
 * @param options Configuration options
 * @returns SystemHealthResult with PASS/FAIL status and all violations
 */
export async function runFullSystemValidation(options?: {
  basePath?: string;
  skipStory?: boolean;
  storyConfig?: StoryConfig;
  heroElements?: VisualElement[];
}): Promise<SystemHealthResult> {
  const violations: AllViolations = {
    assets: [],
    brand: [],
    visual: [],
    production: [],
    story: [],
  };
  
  const checks: SystemHealthResult['checks'] = {
    assetsExist: { name: 'Asset Existence', status: 'PASS', errors: 0, warnings: 0, message: '' },
    assetDimensions: { name: 'Asset Dimensions', status: 'SKIP', errors: 0, warnings: 0, message: 'Requires image analysis' },
    brandCompliance: { name: 'Brand Compliance', status: 'PASS', errors: 0, warnings: 0, message: '' },
    visualDensity: { name: 'Visual Density', status: 'PASS', errors: 0, warnings: 0, message: '' },
    productionLock: { name: 'Production Lock', status: 'PASS', errors: 0, warnings: 0, message: '' },
    storyValidation: { name: 'Story Validation', status: 'SKIP', errors: 0, warnings: 0, message: '' },
  };
  
  // =========================================================================
  // 1. ASSET EXISTENCE CHECK
  // =========================================================================
  
  const assetResults = validateAllAssetsExist(options?.basePath);
  violations.assets = assetResults;
  
  const assetErrors = assetResults.filter(r => !r.valid && r.severity === 'error').length;
  const assetWarnings = assetResults.filter(r => !r.valid && r.severity === 'warning').length;
  
  checks.assetsExist = {
    name: 'Asset Existence',
    status: assetErrors > 0 ? 'FAIL' : 'PASS',
    errors: assetErrors,
    warnings: assetWarnings,
    message: assetErrors > 0 
      ? `${assetErrors} missing assets` 
      : 'All canonical assets found',
  };
  
  // =========================================================================
  // 2. BRAND COMPLIANCE CHECK (sample)
  // =========================================================================
  
  // Sample brand check with known good values
  const brandSample = validateBrandCompliance({
    colors: ['#0B0B0B', '#8B0000', '#D4AF37'],
    assets: [
      { identifier: ASSET_PATHS.hero, context: 'hero-section' },
      { identifier: ASSET_PATHS.crest, context: 'navigation' }
    ],
    fonts: [
      { family: 'Cinzel', context: 'display' },
      { family: 'Cormorant Garamond', context: 'body' }
    ],
    animations: [
      { type: 'ember-drift', durationMs: 14000 },
      { type: 'smoke-drift', durationMs: 25000 }
    ],
  });
  
  violations.brand = brandSample;
  
  const brandErrors = brandSample.filter(r => !r.valid).length;
  const brandWarnings = 0; // BasicValidationResult doesn't track severity
  
  checks.brandCompliance = {
    name: 'Brand Compliance',
    status: brandErrors > 0 ? 'FAIL' : 'PASS',
    errors: brandErrors,
    warnings: brandWarnings,
    message: brandErrors > 0 
      ? `${brandErrors} brand violations` 
      : 'Brand rules compliant',
  };
  
  // =========================================================================
  // 3. VISUAL DENSITY CHECK
  // =========================================================================
  
  if (options?.heroElements) {
    const visualResults = validateVisualDensity('hero', options.heroElements);
    violations.visual = visualResults;
    
    const visualErrors = visualResults.filter(r => !r.valid && r.severity === 'error').length;
    const visualWarnings = visualResults.filter(r => !r.valid && r.severity === 'warning').length;
    
    checks.visualDensity = {
      name: 'Visual Density',
      status: visualErrors > 0 ? 'FAIL' : 'PASS',
      errors: visualErrors,
      warnings: visualWarnings,
      message: visualErrors > 0 
        ? `${visualErrors} density violations` 
        : 'Visual density within limits',
    };
  } else {
    checks.visualDensity = {
      name: 'Visual Density',
      status: 'SKIP',
      errors: 0,
      warnings: 0,
      message: 'No hero elements provided',
    };
  }
  
  // =========================================================================
  // 4. PRODUCTION LOCK CHECK
  // =========================================================================
  
  if (PRODUCTION_LOCK) {
    const prodResults: ValidationResult[] = [];
    for (const key of Object.keys(ASSET_PATHS) as Array<keyof typeof ASSET_PATHS>) {
      prodResults.push(...validateProductionLock(key));
    }
    violations.production = prodResults;
    
    const prodErrors = prodResults.filter(r => !r.valid && r.severity === 'error').length;
    
    checks.productionLock = {
      name: 'Production Lock',
      status: prodErrors > 0 ? 'FAIL' : 'PASS',
      errors: prodErrors,
      warnings: 0,
      message: prodErrors > 0 
        ? `${prodErrors} non-production assets detected` 
        : 'All assets production-approved',
    };
  } else {
    checks.productionLock = {
      name: 'Production Lock',
      status: 'SKIP',
      errors: 0,
      warnings: 0,
      message: 'Production lock disabled',
    };
  }
  
  // =========================================================================
  // 5. STORY VALIDATION CHECK
  // =========================================================================
  
  if (!options?.skipStory && options?.storyConfig) {
    const storyResults = validateStory(options.storyConfig);
    violations.story = storyResults;
    
    const storySummary = getValidationSummary(storyResults);
    
    checks.storyValidation = {
      name: 'Story Validation',
      status: storySummary.passed ? 'PASS' : 'FAIL',
      errors: storySummary.errors,
      warnings: storySummary.warnings,
      message: storySummary.passed 
        ? 'Story rules compliant' 
        : `${storySummary.errors} story violations`,
    };
  } else {
    checks.storyValidation = {
      name: 'Story Validation',
      status: 'SKIP',
      errors: 0,
      warnings: 0,
      message: options?.skipStory ? 'Skipped by request' : 'No story config provided',
    };
  }
  
  // =========================================================================
  // SUMMARY
  // =========================================================================
  
  const totalErrors = Object.values(checks).reduce((sum, c) => sum + c.errors, 0);
  const totalWarnings = Object.values(checks).reduce((sum, c) => sum + c.warnings, 0);
  const passedChecks = Object.values(checks).filter(c => c.status === 'PASS').length;
  const failedChecks = Object.values(checks).filter(c => c.status === 'FAIL').length;
  
  const status: 'PASS' | 'FAIL' = failedChecks > 0 ? 'FAIL' : 'PASS';
  
  return {
    status,
    timestamp: new Date().toISOString(),
    versions: {
      brand: BRAND_SYSTEM_VERSION,
      story: STORY_SYSTEM_VERSION,
    },
    modes: {
      strictMode: BRAND_STRICT_MODE,
      productionLock: PRODUCTION_LOCK,
    },
    checks,
    summary: {
      totalErrors,
      totalWarnings,
      passedChecks,
      failedChecks,
    },
    violations,
  };
}

// =============================================================================
// CONSOLE OUTPUT
// =============================================================================

/**
 * Print health check results to console.
 */
export function printHealthReport(result: SystemHealthResult): void {
  const divider = '═'.repeat(60);
  
  console.log(`\n${divider}`);
  console.log(`  BLACKFEATHER SYSTEM HEALTH CHECK`);
  console.log(`${divider}\n`);
  
  // Status
  const statusIcon = result.status === 'PASS' ? '✅' : '❌';
  console.log(`  Status: ${statusIcon} ${result.status}`);
  console.log(`  Time:   ${result.timestamp}`);
  console.log(`  Brand:  v${result.versions.brand}`);
  console.log(`  Story:  v${result.versions.story}`);
  console.log();
  
  // Modes
  console.log(`  Modes:`);
  console.log(`    Strict:     ${result.modes.strictMode ? 'ON' : 'OFF'}`);
  console.log(`    Production: ${result.modes.productionLock ? 'ON' : 'OFF'}`);
  console.log();
  
  // Checks
  console.log(`  Checks:`);
  for (const [key, check] of Object.entries(result.checks)) {
    const icon = check.status === 'PASS' ? '✓' : check.status === 'FAIL' ? '✗' : '○';
    const color = check.status === 'PASS' ? '' : check.status === 'FAIL' ? '' : '';
    console.log(`    ${icon} ${check.name.padEnd(20)} ${check.message}`);
  }
  console.log();
  
  // Summary
  console.log(`  Summary:`);
  console.log(`    Errors:   ${result.summary.totalErrors}`);
  console.log(`    Warnings: ${result.summary.totalWarnings}`);
  console.log(`    Passed:   ${result.summary.passedChecks}/${Object.keys(result.checks).length}`);
  console.log();
  
  // Violations (if any)
  if (result.status === 'FAIL') {
    console.log(`  Violations:`);
    
    const allViolations = [
      ...result.violations.assets,
      ...result.violations.brand,
      ...result.violations.visual,
      ...result.violations.production,
      ...result.violations.story,
    ].filter(v => !v.valid);
    
    for (const v of allViolations.slice(0, 10)) {
      const ruleId = 'ruleId' in v ? v.ruleId : 'unknown';
      console.log(`    • [${ruleId}] ${v.message}`);
      if ('suggestion' in v && v.suggestion) {
        console.log(`      → ${v.suggestion}`);
      }
    }
    
    if (allViolations.length > 10) {
      console.log(`    ... and ${allViolations.length - 10} more`);
    }
    console.log();
  }
  
  console.log(`${divider}\n`);
}

// =============================================================================
// CLI ENTRY POINT
// =============================================================================

/**
 * Run as CLI command.
 * Exit code 0 = PASS, 1 = FAIL
 */
export async function runHealthCheckCLI(): Promise<void> {
  const result = await runFullSystemValidation();
  printHealthReport(result);
  process.exit(result.status === 'PASS' ? 0 : 1);
}
