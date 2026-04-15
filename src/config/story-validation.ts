/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                              B L A C K F E A T H E R                         ║
 * ║                                                                              ║
 * ║                         STORY VALIDATION MODULE                              ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Validates story content against BLACKFEATHER narrative rules.
 * Use during writing, editing, and content review.
 */

import {
  REVERSAL_RULES,
  ENGINE_RULES,
  EPISODE_FORMAT,
  CHARACTER_TEMPLATE,
  LEAD_RULES,
  RELATIONSHIP_RULES,
  MAGIC_RULES,
  SCENE_RULES,
  QUALITY_CHECKLIST,
  ANTI_PATTERNS,
  type ReversalType,
} from './story-system';

// =============================================================================
// TYPES
// =============================================================================

export interface StoryValidationResult {
  ruleId: string;
  category: 'reversal' | 'character' | 'relationship' | 'magic' | 'scene' | 'episode' | 'arc';
  valid: boolean;
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

export interface EpisodeConfig {
  id: string;
  durationSeconds: number;
  hasHookInFirst5Seconds: boolean;
  reversals: ReversalType[];
  endingType: string;
  powerShifts: number;
  emotionalShift: boolean;
  consequenceIntroduced: boolean;
}

export interface SceneConfig {
  id: string;
  dominantPurpose: string;
  hasDialogue: boolean;
  dialogueHasConflict?: boolean;
  hasMagic: boolean;
  magicComplicates?: boolean;
  hasLore: boolean;
  loreWithConflict?: boolean;
  emotionalShift: boolean;
}

export interface CharacterConfig {
  id: string;
  role: string;
  fields: Partial<Record<string, boolean>>;
}

export interface ReversalEntry {
  chapter: number;
  scene: number;
  startingState: string;
  endingState: string;
  powerShift: string;
  type: ReversalType;
  escalationLevel: number;
}

export interface ArcConfig {
  episodes: EpisodeConfig[];
  reversalCount: number;
  relationshipInversions: number;
  statusShifts: number;
}

// =============================================================================
// EPISODE VALIDATION
// =============================================================================

/**
 * Validate an episode against BLACKFEATHER rules
 */
export function validateEpisode(config: EpisodeConfig): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  // Check duration
  const { min, max } = EPISODE_FORMAT.duration.default;
  if (config.durationSeconds < min) {
    results.push({
      ruleId: 'episode-duration-min',
      category: 'episode',
      valid: false,
      severity: 'warning',
      message: `Episode ${config.id} is ${config.durationSeconds}s, minimum is ${min}s`,
      suggestion: 'Add content or combine with adjacent episode',
    });
  }
  if (config.durationSeconds > EPISODE_FORMAT.duration.premium.max) {
    results.push({
      ruleId: 'episode-duration-max',
      category: 'episode',
      valid: false,
      severity: 'warning',
      message: `Episode ${config.id} is ${config.durationSeconds}s, maximum is ${EPISODE_FORMAT.duration.premium.max}s`,
      suggestion: 'Split into multiple episodes',
    });
  }
  
  // Check hook
  if (!config.hasHookInFirst5Seconds) {
    results.push({
      ruleId: 'episode-hook',
      category: 'episode',
      valid: false,
      severity: 'error',
      message: `Episode ${config.id} missing hook in first ${EPISODE_FORMAT.coldEntrySeconds} seconds`,
      suggestion: 'Start with visible tension, not setup',
    });
  }
  
  // Check reversal count
  if (config.reversals.length < REVERSAL_RULES.density.perEpisode) {
    results.push({
      ruleId: 'episode-reversal',
      category: 'reversal',
      valid: false,
      severity: 'error',
      message: `Episode ${config.id} has ${config.reversals.length} reversals, minimum is ${REVERSAL_RULES.density.perEpisode}`,
      suggestion: 'Add emotional, relational, or situational reversal',
    });
  }
  
  // Check ending type
  const forbiddenEndings = ['neutral-stability', 'emotional-resolution', 'complete-safety'];
  if (forbiddenEndings.includes(config.endingType)) {
    results.push({
      ruleId: 'episode-ending',
      category: 'episode',
      valid: false,
      severity: 'error',
      message: `Episode ${config.id} ends in "${config.endingType}" — forbidden`,
      suggestion: 'End with cliffhanger, revelation, betrayal, threshold, or debt-creation',
    });
  }
  
  // Check emotional shift
  if (!config.emotionalShift) {
    results.push({
      ruleId: 'episode-emotional-shift',
      category: 'episode',
      valid: false,
      severity: 'warning',
      message: `Episode ${config.id} has no emotional shift`,
      suggestion: 'Character emotional state must change',
    });
  }
  
  // Check consequence
  if (!config.consequenceIntroduced) {
    results.push({
      ruleId: 'episode-consequence',
      category: 'episode',
      valid: false,
      severity: 'warning',
      message: `Episode ${config.id} introduces no consequence`,
      suggestion: 'Consequences rule: no meaningful act is free',
    });
  }
  
  return results;
}

// =============================================================================
// SCENE VALIDATION
// =============================================================================

/**
 * Validate a scene against BLACKFEATHER rules
 */
export function validateScene(config: SceneConfig): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  // Check dominant purpose
  if (!(SCENE_RULES.dominantPurposes as readonly string[]).includes(config.dominantPurpose)) {
    results.push({
      ruleId: 'scene-purpose',
      category: 'scene',
      valid: false,
      severity: 'warning',
      message: `Scene ${config.id} purpose "${config.dominantPurpose}" not in allowed list`,
      suggestion: `Allowed: ${SCENE_RULES.dominantPurposes.join(', ')}`,
    });
  }
  
  // Check dialogue conflict
  if (config.hasDialogue && !config.dialogueHasConflict) {
    results.push({
      ruleId: 'scene-dialogue-conflict',
      category: 'scene',
      valid: false,
      severity: 'error',
      message: `Scene ${config.id} has dialogue without conflict`,
      suggestion: 'At least one character must want something the other cannot safely give',
    });
  }
  
  // Check magic complication
  if (config.hasMagic && !config.magicComplicates) {
    results.push({
      ruleId: 'scene-magic',
      category: 'magic',
      valid: false,
      severity: 'error',
      message: `Scene ${config.id} has magic that doesn't complicate`,
      suggestion: 'Magic must leave situation more complicated than before',
    });
  }
  
  // Check lore with conflict
  if (config.hasLore && !config.loreWithConflict) {
    results.push({
      ruleId: 'scene-lore',
      category: 'scene',
      valid: false,
      severity: 'error',
      message: `Scene ${config.id} has lore dump without live conflict`,
      suggestion: 'Lore must arrive while conflict is happening',
    });
  }
  
  // Check emotional shift
  if (!config.emotionalShift) {
    results.push({
      ruleId: 'scene-emotional-shift',
      category: 'scene',
      valid: false,
      severity: 'warning',
      message: `Scene ${config.id} has no emotional shift`,
      suggestion: 'Every scene requires emotional movement',
    });
  }
  
  return results;
}

// =============================================================================
// CHARACTER VALIDATION
// =============================================================================

/**
 * Validate character has all required fields
 */
export function validateCharacter(config: CharacterConfig): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  const missingFields = CHARACTER_TEMPLATE.requiredFields.filter(
    field => !config.fields[field]
  );
  
  if (missingFields.length > 0) {
    results.push({
      ruleId: 'character-fields',
      category: 'character',
      valid: false,
      severity: 'error',
      message: `Character ${config.id} missing fields: ${missingFields.join(', ')}`,
      suggestion: 'Complete all character builder fields before writing',
    });
  }
  
  return results;
}

/**
 * Validate lead character meets requirements
 */
export function validateLeadCharacter(
  traits: string[]
): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  const missingRequirements = LEAD_RULES.requirements.filter(
    req => !traits.some(t => t.toLowerCase().includes(req.toLowerCase().split(' ')[0]))
  );
  
  if (missingRequirements.length > 0) {
    results.push({
      ruleId: 'lead-requirements',
      category: 'character',
      valid: false,
      severity: 'warning',
      message: `Lead character may be missing: ${missingRequirements.slice(0, 3).join('; ')}...`,
      suggestion: 'Review lead character rules',
    });
  }
  
  return results;
}

// =============================================================================
// REVERSAL TRACKING VALIDATION
// =============================================================================

/**
 * Validate reversal density across episodes
 */
export function validateReversalDensity(
  reversals: ReversalEntry[],
  totalEpisodes: number
): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  // Check minimum per episode (aggregate)
  const avgPerEpisode = reversals.length / totalEpisodes;
  if (avgPerEpisode < REVERSAL_RULES.density.perEpisode) {
    results.push({
      ruleId: 'reversal-density',
      category: 'reversal',
      valid: false,
      severity: 'error',
      message: `Average ${avgPerEpisode.toFixed(1)} reversals per episode, minimum is ${REVERSAL_RULES.density.perEpisode}`,
      suggestion: 'Add more reversals — this is the most important structural rule',
    });
  }
  
  // Check escalation trend
  const escalations = reversals.map(r => r.escalationLevel);
  const avgFirst = escalations.slice(0, Math.floor(escalations.length / 2))
    .reduce((a, b) => a + b, 0) / (escalations.length / 2) || 0;
  const avgSecond = escalations.slice(Math.floor(escalations.length / 2))
    .reduce((a, b) => a + b, 0) / (escalations.length / 2) || 0;
  
  if (avgSecond <= avgFirst && escalations.length > 4) {
    results.push({
      ruleId: 'reversal-escalation',
      category: 'reversal',
      valid: false,
      severity: 'warning',
      message: `Escalation not increasing: first half avg ${avgFirst.toFixed(1)}, second half avg ${avgSecond.toFixed(1)}`,
      suggestion: 'Stakes must increase over time',
    });
  }
  
  // Check for plateau (same escalation level for 3+ entries)
  for (let i = 0; i < escalations.length - 2; i++) {
    if (escalations[i] === escalations[i+1] && escalations[i+1] === escalations[i+2]) {
      results.push({
        ruleId: 'reversal-plateau',
        category: 'reversal',
        valid: false,
        severity: 'warning',
        message: `Potential plateau at entries ${i+1}-${i+3}: escalation stuck at level ${escalations[i]}`,
        suggestion: `No plateau rule: all maps cannot stay flat for more than ${ENGINE_RULES.plateauLimit} episodes`,
      });
      break;
    }
  }
  
  return results;
}

// =============================================================================
// ARC VALIDATION
// =============================================================================

/**
 * Validate a micro-arc or season arc
 */
export function validateArc(config: ArcConfig): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  // Check each episode
  for (const episode of config.episodes) {
    results.push(...validateEpisode(episode));
  }
  
  // Check arc-level reversal count
  const expectedUnexpected = Math.floor(config.episodes.length / 5);
  if (config.reversalCount < expectedUnexpected) {
    results.push({
      ruleId: 'arc-unexpected-reversals',
      category: 'arc',
      valid: false,
      severity: 'warning',
      message: `Arc has ${config.reversalCount} unexpected reversals, expected at least ${expectedUnexpected} (1 per 5 episodes)`,
    });
  }
  
  // Check relationship inversions for 10+ episode arcs
  if (config.episodes.length >= 10 && config.relationshipInversions < 1) {
    results.push({
      ruleId: 'arc-relationship-inversion',
      category: 'arc',
      valid: false,
      severity: 'error',
      message: `10-episode arc requires at least 1 relationship inversion`,
    });
  }
  
  // Check status shifts for 10+ episode arcs
  if (config.episodes.length >= 10 && config.statusShifts < 1) {
    results.push({
      ruleId: 'arc-status-shift',
      category: 'arc',
      valid: false,
      severity: 'error',
      message: `10-episode arc requires at least 1 major status shift`,
    });
  }
  
  return results;
}

// =============================================================================
// ANTI-PATTERN DETECTION
// =============================================================================

/**
 * Check for common anti-patterns
 */
export function detectAntiPatterns(
  description: string
): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  const lower = description.toLowerCase();
  
  const patterns: Array<{ pattern: string; keyword: string }> = [
    { pattern: 'Long setup without visible premise delivery', keyword: 'setup' },
    { pattern: 'Beautiful atmosphere with no status changes', keyword: 'atmosphere' },
    { pattern: 'Magic that solves problems too cleanly', keyword: 'solves' },
    { pattern: 'Love interest who becomes emotionally safe too early', keyword: 'safe' },
    { pattern: 'Worldbuilding that overwhelms the emotional spine', keyword: 'worldbuilding' },
  ];
  
  for (const { pattern, keyword } of patterns) {
    if (lower.includes(keyword) && lower.includes('no ') || lower.includes('without ')) {
      results.push({
        ruleId: 'anti-pattern',
        category: 'arc',
        valid: false,
        severity: 'warning',
        message: `Potential anti-pattern: ${pattern}`,
        suggestion: 'Review against anti-pattern list',
      });
    }
  }
  
  return results;
}

// =============================================================================
// QUALITY CHECKLIST RUNNER
// =============================================================================

export interface QualityCheckInput {
  hasEmotionalImpact: boolean;
  themeReinforced: boolean;
  rulesFollowed: boolean;
  conflictPresent: boolean;
  progressionClear: boolean;
}

/**
 * Run quality checklist before writing
 */
export function runQualityChecklist(
  input: QualityCheckInput
): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  if (!input.hasEmotionalImpact) {
    results.push({
      ruleId: 'quality-emotional',
      category: 'scene',
      valid: false,
      severity: 'error',
      message: 'No emotional impact defined',
    });
  }
  
  if (!input.themeReinforced) {
    results.push({
      ruleId: 'quality-theme',
      category: 'scene',
      valid: false,
      severity: 'warning',
      message: 'Theme not reinforced',
    });
  }
  
  if (!input.rulesFollowed) {
    results.push({
      ruleId: 'quality-rules',
      category: 'scene',
      valid: false,
      severity: 'error',
      message: 'Rules not followed',
    });
  }
  
  if (!input.conflictPresent) {
    results.push({
      ruleId: 'quality-conflict',
      category: 'scene',
      valid: false,
      severity: 'error',
      message: 'No conflict present',
    });
  }
  
  if (!input.progressionClear) {
    results.push({
      ruleId: 'quality-progression',
      category: 'scene',
      valid: false,
      severity: 'warning',
      message: 'Progression unclear',
    });
  }
  
  return results;
}

// =============================================================================
// COMPREHENSIVE STORY VALIDATION
// =============================================================================

export interface StoryConfig {
  episodes: EpisodeConfig[];
  scenes: SceneConfig[];
  characters: CharacterConfig[];
  reversals: ReversalEntry[];
}

/**
 * Run full story validation
 */
export function validateStory(config: StoryConfig): StoryValidationResult[] {
  const results: StoryValidationResult[] = [];
  
  // Validate all episodes
  for (const episode of config.episodes) {
    results.push(...validateEpisode(episode));
  }
  
  // Validate all scenes
  for (const scene of config.scenes) {
    results.push(...validateScene(scene));
  }
  
  // Validate all characters
  for (const character of config.characters) {
    results.push(...validateCharacter(character));
  }
  
  // Validate reversal density
  results.push(...validateReversalDensity(config.reversals, config.episodes.length));
  
  return results;
}

/**
 * Get summary of validation results
 */
export function getValidationSummary(
  results: StoryValidationResult[]
): { errors: number; warnings: number; passed: boolean } {
  const errors = results.filter(r => !r.valid && r.severity === 'error').length;
  const warnings = results.filter(r => !r.valid && r.severity === 'warning').length;
  
  return {
    errors,
    warnings,
    passed: errors === 0,
  };
}
