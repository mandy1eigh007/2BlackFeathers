/**
 * BLACKFEATHER Brand System — Public API
 * 
 * Import from here to access all brand rules, validation, and enforcement utilities.
 * 
 * @example
 * import { 
 *   COLORS, 
 *   ASSET_PATHS,
 *   validateComponent, 
 *   enforceCompliance,
 *   BRAND_STRICT_MODE 
 * } from '@/config/brand';
 */

// =============================================================================
// CORE BRAND SYSTEM RULES AND CONSTANTS
// =============================================================================

export {
  // === SYSTEM VERSION & LOCKS ===
  BRAND_SYSTEM_VERSION,
  BRAND_STRICT_MODE,
  PRODUCTION_LOCK,
  ACTIVE_OVERRIDES,
  
  // === RULE ID REGISTRY ===
  RULE_IDS,
  CHANGE_LOG,
  
  // === CANONICAL ASSET PATHS ===
  ASSET_PATHS,
  ASSET_METADATA,
  ASSET_DIMENSIONS,
  
  // === Hierarchy and classification ===
  SOURCE_HIERARCHY,
  DEFAULT_ASSET_STATUS,
  
  // === Assets ===
  CANONICAL_ASSETS,
  
  // === Colors ===
  COLORS,
  PROHIBITED_COLORS,
  
  // === Typography ===
  TYPOGRAPHY,
  
  // === Motion ===
  MOTION,
  MOTION_LIMITS,
  
  // === Components ===
  COMPONENT_RULES,
  
  // === Layout ===
  LAYOUT_RULES,
  SPACING_SCALE,
  
  // === Focal Points ===
  FOCAL_POINT_RULES,
  
  // === Readability ===
  READABILITY_RULES,
  
  // === Visual Density ===
  VISUAL_DENSITY_RULES,
  
  // === Logo usage ===
  LOGO_USAGE,
  
  // === Thumbnails ===
  THUMBNAIL_RULES,
  
  // === File naming ===
  FILE_NAMING,
  
  // === Export rules ===
  EXPORT_RULES,
  
  // === Character usage ===
  CHARACTER_RULES,
  
  // === Website rules ===
  WEBSITE_RULES,
  
  // === Storage structure ===
  STORAGE_STRUCTURE,
  
  // === Generation discipline ===
  GENERATION_RULES,
  
  // === Transfer instruction ===
  TRANSFER_INSTRUCTION,
  
  // === Core principle ===
  CORE_PRINCIPLE,
  
  // === Utility exports ===
  getTailwindColors,
  getCSSVariables,
  
  // === Types ===
  type SourceTier,
  type AssetStatus,
  type AssetRole,
  type CanonicalAsset,
  type RuleOverride,
  type SpacingKey,
  type AssetPath,
  type AssetMetadata,
  type RuleId,
  type ChangeLogEntry,
} from './brand-system';

// =============================================================================
// VALIDATION UTILITIES (BASIC)
// =============================================================================

export {
  // Color validation
  isApprovedColor,
  validateColor,
  
  // Asset validation
  getAsset,
  canUseAssetInContext,
  getLogoForContext,
  
  // Motion validation
  isAnimationAllowed,
  validateAnimationDuration,
  
  // Typography validation
  isApprovedFont,
  validateFontUsage,
  
  // Thumbnail validation
  validateThumbnailDimensions,
  
  // Comprehensive validation
  validateBrandCompliance,
  isFullyCompliant,
  getViolations,
  
  // Dev helpers
  warnIfNonCompliant,
  enforceCompliance as enforceBasicCompliance,
  
  // Types
  type ValidationResult as BasicValidationResult,
} from './brand-validation';

// =============================================================================
// ENFORCEMENT MODULE (COMPREHENSIVE)
// =============================================================================

export {
  // === Override Management ===
  overrideRule,
  hasOverride,
  getActiveOverrides,
  
  // === Component Validation ===
  validateComponent,
  
  // === Layout Validation ===
  validateLayout,
  
  // === Focal Point Validation ===
  validateFocalPoints,
  
  // === Motion Validation ===
  validateMotionBudget,
  
  // === Readability Validation ===
  validateAssetReadability,
  
  // === Asset Existence Validation ===
  validateAssetExists,
  validateAllAssetsExist,
  
  // === Visual Density Validation ===
  validateVisualDensity,
  
  // === Production Lock Validation ===
  validateProductionLock,
  
  // === Page Validation ===
  validatePage,
  
  // === CI / Build Enforcement ===
  enforceCompliance,
  preCommitCheck,
  buildCheck,
  
  // === Types ===
  type ValidationResult,
  type ComponentConfig,
  type LayoutConfig,
  type PageConfig,
  type VisualElement,
} from './brand-enforcement';

// =============================================================================
// STORY SYSTEM (NARRATIVE RULES)
// =============================================================================

export {
  // === Version ===
  STORY_SYSTEM_VERSION,
  
  // === Core Identity ===
  CORE_PROMISES,
  POSITIONING,
  
  // === Episode Format ===
  EPISODE_FORMAT,
  
  // === Reversal System ===
  REVERSAL_RULES,
  
  // === Engine Rules ===
  ENGINE_RULES,
  
  // === Character System ===
  CHARACTER_ROLES,
  CHARACTER_TEMPLATE,
  LEAD_RULES,
  
  // === Relationship System ===
  RELATIONSHIP_RULES,
  
  // === Magic System ===
  MAGIC_RULES,
  
  // === Scene Rules ===
  SCENE_RULES,
  EPISODE_TEMPLATE,
  
  // === Arc Templates ===
  MICRO_ARC_TEMPLATES,
  
  // === Anti-Patterns ===
  ANTI_PATTERNS,
  
  // === Quality Control ===
  QUALITY_CHECKLIST,
  
  // === Visual-Narrative Alignment ===
  VISUAL_NARRATIVE_ALIGNMENT,
  
  // === Build Sequence ===
  BUILD_SEQUENCE,
  
  // === Types ===
  type CorePromise,
  type ReversalType,
  type CharacterRole,
  type MicroArcType,
} from './story-system';

// =============================================================================
// STORY VALIDATION
// =============================================================================

export {
  // === Episode Validation ===
  validateEpisode,
  
  // === Scene Validation ===
  validateScene,
  
  // === Character Validation ===
  validateCharacter,
  validateLeadCharacter,
  
  // === Reversal Validation ===
  validateReversalDensity,
  
  // === Arc Validation ===
  validateArc,
  
  // === Anti-Pattern Detection ===
  detectAntiPatterns,
  
  // === Quality Checklist ===
  runQualityChecklist,
  
  // === Comprehensive Validation ===
  validateStory,
  getValidationSummary,
  
  // === Types ===
  type StoryValidationResult,
  type EpisodeConfig,
  type SceneConfig,
  type CharacterConfig,
  type ReversalEntry,
  type ArcConfig,
  type QualityCheckInput,
  type StoryConfig,
} from './story-validation';

// =============================================================================
// SYSTEM HEALTH CHECK
// =============================================================================

export {
  // === Full System Validation ===
  runFullSystemValidation,
  
  // === Asset Dimension Validation ===
  validateAssetDimensions,
  
  // === Console Output ===
  printHealthReport,
  
  // === CLI Entry ===
  runHealthCheckCLI,
  
  // === Types ===
  type SystemHealthResult,
  type CheckResult,
  type AllViolations,
} from './system-health';
