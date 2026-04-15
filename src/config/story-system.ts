/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                              B L A C K F E A T H E R                         ║
 * ║                                                                              ║
 * ║                             STORY SYSTEM                                     ║
 * ║                    Content Rules for App Spin-Offs                           ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file defines the NARRATIVE rules for BLACKFEATHER content.
 * It integrates with the brand-system.ts visual rules.
 * 
 * Source documents:
 * - Blackfeather_App_SpinOff_Series_Bible_v4.docx
 * - Series_Bible_Market_Aligned_Epic_Dark_Fantasy.docx
 * - Epic_Novel_Success_Framework.docx
 * - Master_Story_System_Index.docx
 * 
 * @version 1.0.0
 * @lastUpdated 2026-04-14
 */

// =============================================================================
// STORY SYSTEM VERSION
// =============================================================================

export const STORY_SYSTEM_VERSION = '1.0.0';

// =============================================================================
// CORE IDENTITY — NON-NEGOTIABLE PROMISES
// =============================================================================

/**
 * BLACKFEATHER is defined by five non-negotiable promises.
 * Every piece of content must satisfy ALL of these.
 */
export const CORE_PROMISES = {
  /**
   * Power always has intimacy attached to it.
   * Political moves are also emotional moves.
   */
  POWER_INTIMACY: 'power-intimacy-link',
  
  /**
   * Routine details matter.
   * Laundry steam, wood grain, blood crust, breath, silk drag, metal vibration.
   * These are not filler; they are world truth.
   */
  TACTILE_TRUTH: 'tactile-world-truth',
  
  /**
   * Dialogue is combat.
   * Characters extract, conceal, provoke, redirect, threaten.
   * They do NOT casually explain.
   */
  DIALOGUE_COMBAT: 'dialogue-as-combat',
  
  /**
   * Interiority is fragmented but precise.
   * The internal voice sharpens the scene, not summarizes it.
   */
  FRAGMENTED_INTERIORITY: 'fragmented-precise-interiority',
  
  /**
   * Beauty must never sterilize the world.
   * The frame may be elegant; the world inside must remain tactile, stained, frayed, bodily.
   */
  BEAUTIFUL_GRIME: 'beauty-with-grime',
} as const;

// =============================================================================
// CONTENT POSITIONING
// =============================================================================

export const POSITIONING = {
  genre: 'dark fantasy short drama',
  emotionalPromise: [
    'manipulation',
    'betrayal', 
    'yearning',
    'dread',
    'violation',
    'desperate attachment',
  ],
  visualPromise: 'prestige oil-painting contrast with tactile grime',
  plotPromise: 'rapid reversals, secrets, debt, dangerous resurrection, political consequences',
  relationshipPromise: 'no safe romance; desire is leverage',
  
  /**
   * One-sentence positioning statement
   */
  statement: 'Dark epic fantasy with death-bound memory magic, court betrayal, and a love story built on manipulation rather than safety.',
  
  /**
   * What the package must signal immediately
   */
  signalRequirements: [
    'This is fantasy, not literary ambiguity',
    'This is emotionally intense and dangerous, not light adventure',
    'This is relationship-driven, but the relationship is unsafe',
    'This is political succession conflict, not isolated survival',
    'This is a series with continuing consequence',
  ],
} as const;

// =============================================================================
// EPISODE FORMAT (APP DELIVERY)
// =============================================================================

export const EPISODE_FORMAT = {
  /**
   * Primary format: vertical-first short drama
   * Framing privileges: faces, hands, wounds, objects, doorways, close interpersonal distance
   */
  orientation: 'vertical-first',
  
  /**
   * Duration targets in seconds
   */
  duration: {
    default: { min: 60, max: 90 },
    premium: { min: 90, max: 120 },  // For major reveals only
  },
  
  /**
   * Season structure
   */
  season: {
    episodesMin: 40,
    episodesMax: 80,
  },
  
  /**
   * Binge cluster targets — episodes chain in sets
   */
  clusters: {
    small: 3,   // Meaningful emotional break every 3 episodes
    medium: 5,  // Material reversal every 5 episodes
    large: 10,  // Major narrative payment every 10 episodes
  },
  
  /**
   * Entry requirement: cold viewer understands tension within seconds
   */
  coldEntrySeconds: 3,
  
  /**
   * Exit requirement: NO episode ends in emotional neutrality or stability
   */
  exitRequirement: 'destabilized',
} as const;

// =============================================================================
// REVERSAL SYSTEM — THE MOST IMPORTANT STRUCTURAL RULE
// =============================================================================

/**
 * Research finding: stories with more frequent and intense reversals
 * performed better across media. (Knight, Rocklage, Bart 2024)
 * 
 * This is NON-NEGOTIABLE.
 */
export const REVERSAL_RULES = {
  /**
   * Reversal density requirements
   */
  density: {
    perEpisode: 1,           // Minimum 1 directional shift per episode
    unexpectedPer5Episodes: 1, // At least 1 unexpected reversal per 5 episodes
    perChapter: 1,           // For novel format: 1 per chapter minimum
    perAct: {
      relationshipInversion: 1,
      statusInversion: 1,
    },
    perVolume: {
      beliefChange: ['self', 'magic', 'love-interest', 'throne'],
    },
  },
  
  /**
   * What counts as a reversal
   */
  types: [
    'emotional-shift',       // Character's emotional state inverts
    'power-shift',           // Who holds leverage changes
    'trust-betrayal',        // Trust is given or broken
    'safety-danger',         // Situation becomes safer or more dangerous
    'knowledge-shift',       // Information changes understanding
    'status-shift',          // Social/political position changes
    'relationship-inversion', // Dynamic between characters flips
    'identity-shift',        // Self-understanding changes
  ],
  
  /**
   * Build-up rule: A reversal only lands if you first give
   * the reader a meaningful position to lose.
   */
  buildUpRequired: true,
  
  /**
   * Tracking fields for reversal validation
   */
  trackingFields: [
    'startingEmotionalState',
    'endingEmotionalState',
    'powerShift',
    'reversalType',
    'internalConflict',
    'relationalConflict',
    'externalConflict',
    'magicUsed',
    'consequenceIntroduced',
    'escalationLevel',
  ],
} as const;

// =============================================================================
// STORY ENGINE RULES
// =============================================================================

export const ENGINE_RULES = {
  /**
   * RULE 1: Reversal Density
   * Every episode must contain at least one directional shift.
   */
  reversalDensity: {
    perEpisode: 1,
    types: ['emotional', 'relational', 'situational'],
  },
  
  /**
   * RULE 2: Escalation
   * Episode must end with WORSE danger, knowledge cost, emotional exposure,
   * or more unstable alliance.
   */
  escalation: {
    required: true,
    endpoints: ['worse-danger', 'knowledge-cost', 'emotional-exposure', 'unstable-alliance'],
  },
  
  /**
   * RULE 3: Consequences
   * No meaningful act is free. Lead must pay in:
   */
  consequenceCurrencies: [
    'body',
    'identity',
    'leverage',
    'memory',
    'trust',
    'position',
  ],
  
  /**
   * RULE 4: Clarity
   * Each episode must be visually legible and emotionally decipherable on first pass.
   * Confusion may exist INSIDE the scene, but viewer must understand WHAT MATTERS.
   */
  clarity: {
    firstPassDecipherable: true,
    confusionAllowed: 'inside-scene-only',
  },
  
  /**
   * RULE 5: Playfulness
   * Even dark content must provide pleasure through:
   */
  pleasureSources: [
    'sharp-reversals',
    'dangerous-banter',
    'tactile-detail',
    'visual-motifs',
    'satisfying-micro-payoffs',
  ],
  
  /**
   * RULE 6: No Plateau
   * If relationship map, danger map, and information map ALL remain flat
   * for more than 2 episodes, the arc is failing.
   */
  plateauLimit: 2,  // episodes
} as const;

// =============================================================================
// CHARACTER ARCHITECTURE
// =============================================================================

/**
 * Character roles that must exist in any BLACKFEATHER story
 */
export const CHARACTER_ROLES = {
  testedSovereign: {
    name: 'The Tested Lead',
    viewerEffect: 'protectiveness plus fascination',
    requirements: [
      'Visibly pressured',
      'Morally unstable under stress',
      'Capable of stillness',
      'Dangerous only at cost',
    ],
  },
  
  architect: {
    name: 'The Architect',
    viewerEffect: 'dread plus attraction',
    requirements: [
      'Always alters the meaning of the scene',
      'Never appears without changing leverage',
      'Has theory of lead before she has one of herself',
      'Clinically composed surface, exact pressure beneath',
    ],
  },
  
  alternativeClaim: {
    name: 'The Alternative Claim',
    viewerEffect: 'fantasy of safety or second path',
    requirements: [
      'Tempts both lead and audience with different future',
    ],
  },
  
  dutyBlade: {
    name: 'The Duty Blade',
    viewerEffect: 'authority, guilt, burden, restrained violence',
    requirements: [
      'Gives moral and physical weight to systems',
    ],
  },
  
  memoryWitness: {
    name: 'The Memory Witness',
    viewerEffect: 'tenderness, grief, origin truth',
    requirements: [
      'Links routine objects to identity wounds',
    ],
  },
  
  courtPredator: {
    name: 'The Court Predator',
    viewerEffect: 'instability',
    requirements: [
      'Creates social danger',
      'Gossip, spectacle, rank pressure',
    ],
  },
  
  betrayedLoyalist: {
    name: 'The Betrayed Loyalist',
    viewerEffect: 'hurt',
    requirements: [
      'Introduce trust, then weaponize it quickly',
    ],
  },
} as const;

/**
 * Required fields for every recurring character
 */
export const CHARACTER_TEMPLATE = {
  requiredFields: [
    'surfaceRole',
    'privateWound',
    'publicMask',
    'primaryDesire',
    'controlMethod',
    'willingToSacrifice',
    'cannotTolerate',
    'relationshipPayload',
    'visualAnchor',
    'audioLineSignature',
    'secret',
    'whatTheyTriggerInLead',
    'whatLeadTriggersInThem',
    'arcDirection',
  ],
} as const;

/**
 * Lead character rules (role rules, not biography)
 */
export const LEAD_RULES = {
  requirements: [
    'May be elegant, but cannot be emotionally invulnerable',
    'Cannot solve pressure through brute strength',
    'Survives through cost, intelligence, leverage, or dangerous power',
    'Must have public mask and private fracture',
    'Must want connection enough that manipulation is possible',
    'Must be able to wound others emotionally, not only be wounded',
    'Image must be recognizable in silhouette and close-up',
    'Suffering must change her, not merely decorate her',
  ],
  coreWeakness: 'She confuses being chosen with being truly valued',
  coreNeed: 'Reliable belonging and truth — this is why manipulation works on her',
} as const;

// =============================================================================
// RELATIONSHIP ENGINE
// =============================================================================

export const RELATIONSHIP_RULES = {
  /**
   * Relationships are not subplots. They are the power grid.
   */
  principle: 'Relationships are the power grid',
  
  requirements: [
    'Every core relationship must contain asymmetry',
    'Every core relationship must evolve — static attraction forbidden',
    'Intimacy must cause leverage',
    'Trust cannot remain intact for long stretches',
  ],
  
  /**
   * Types of asymmetry required
   */
  asymmetryTypes: [
    'rank',
    'knowledge',
    'need',
    'debt',
    'danger',
    'timing',
    'desire',
  ],
  
  /**
   * Viewer test: Can viewer answer these questions?
   */
  viewerTest: [
    'What does each person want from the other right now?',
    'What are they hiding?',
  ],
  
  /**
   * Intimacy rules
   */
  intimacy: {
    mustCauseLeverage: true,
    consequenceTypes: ['touch', 'confession', 'rescue', 'wound'],
    resultRequired: 'changes what can happen next',
  },
} as const;

// =============================================================================
// MAGIC SYSTEM RULES
// =============================================================================

export const MAGIC_RULES = {
  /**
   * Magic is a narrative engine, not a visual effects menu.
   */
  principle: 'Magic is narrative engine, not decoration',
  
  requirements: [
    'Visible enough for phone viewer to read immediately',
    'Must carry bodily or identity cost',
    'Must complicate the plot, not solve it',
    'Must amplify emotional and political stakes',
    'Triggers must be emotionally legible and cinematically repeatable',
    'Viewer can learn pattern quickly, but not predict every result',
  ],
  
  /**
   * Recommended thematic model: death-bound emotional memory
   */
  recommendedModel: {
    name: 'death-bound emotional memory',
    description: 'Access to emotional residues, fractured memories, and death-near states that translate into leverage, destabilization, recognition, or compulsion',
  },
  
  /**
   * What the power must cost
   */
  costTypes: [
    'memory-damage',
    'dissociation',
    'emotional-flooding',
    'distorted-certainty',
    'bodily-pain',
    'loss-of-clean-self-knowledge',
  ],
  
  /**
   * Visual cues for magic (phone-readable)
   */
  visualCues: [
    'obsidian-veining',
    'breath-change',
    'pulse-rhythm',
    'surface-frost',
    'stain-spread',
    'pressure-in-fabric',
    'sound-distortion',
  ],
} as const;

// =============================================================================
// SCENE RULES
// =============================================================================

export const SCENE_RULES = {
  /**
   * Every scene must have ONE dominant purpose
   */
  dominantPurposes: [
    'seduction',
    'bargaining',
    'concealment',
    'escape',
    'humiliation',
    'revelation',
    'reversal',
  ],
  
  requirements: [
    'One objective per scene',
    'Emotional shift required',
    'Must impact character or conflict',
    'No filler content',
  ],
  
  dialogue: {
    rule: 'If scene has dialogue, at least one character must want something the other cannot safely give',
  },
  
  magic: {
    rule: 'If magic appears, scene must leave situation more complicated than before',
  },
  
  lore: {
    rule: 'No scene exists purely to explain lore. Lore must arrive while live conflict is happening.',
  },
} as const;

// =============================================================================
// EPISODE STRUCTURE TEMPLATE
// =============================================================================

export const EPISODE_TEMPLATE = {
  /**
   * Mandatory episode structure
   */
  structure: {
    hook: {
      position: 'first 3-5 seconds',
      requirement: 'Visible tension, not setup',
    },
    body: {
      requirement: 'At least one reversal',
    },
    ending: {
      requirement: 'Continuation pressure',
      allowed: [
        'cliffhanger',
        'revelation',
        'betrayal',
        'threshold',
        'debt-creation',
      ],
      forbidden: [
        'neutral-stability',
        'emotional-resolution',
        'complete-safety',
      ],
    },
  },
} as const;

// =============================================================================
// MICRO-ARC BUILDERS
// =============================================================================

export const MICRO_ARC_TEMPLATES = {
  /**
   * 3-episode micro-arc
   */
  threeEpisode: {
    name: '3-Episode Micro-Arc',
    structure: ['setup', 'reversal', 'cliff-payment'],
  },
  
  /**
   * 5-episode micro-arc
   */
  fiveEpisode: {
    name: '5-Episode Micro-Arc',
    structure: ['setup', 'attachment', 'destabilization', 'betrayal-reveal', 'consequence'],
  },
  
  /**
   * 10-episode movement
   */
  tenEpisode: {
    name: '10-Episode Movement',
    requirements: [
      'One major status shift',
      'One relationship inversion',
      'One cost escalation',
      'One memorable image or line',
    ],
  },
} as const;

// =============================================================================
// ANTI-PATTERNS (WHAT WILL LOSE THE AUDIENCE)
// =============================================================================

export const ANTI_PATTERNS = [
  'Long setup without visible premise delivery',
  'Beautiful atmosphere with no status changes',
  'Magic that solves problems too cleanly',
  'Love interest who becomes emotionally safe too early',
  'Worldbuilding that overwhelms the emotional spine',
  'Plateau: all maps flat for more than 2 episodes',
  'Episode ending in neutrality or stability',
  'Dialogue that explains instead of combats',
  'Violence without structural consequence',
  'Empty cruelty (shock without downstream effect)',
] as const;

// =============================================================================
// QUALITY CONTROL CHECKLIST
// =============================================================================

export const QUALITY_CHECKLIST = {
  /**
   * Before adding content, verify:
   */
  beforeWriting: [
    'Emotional impact exists',
    'Theme is reinforced',
    'Rules are not broken',
    'Conflict is present',
    'Progression is clear',
  ],
  
  /**
   * Episode approval checklist
   */
  episodeApproval: [
    'Hook in first 3 seconds',
    'At least 1 reversal',
    'Ending creates continuation pressure',
    'Clarity: viewer understands what matters',
    'No plateau violation',
    'Consequence introduced',
  ],
  
  /**
   * Failure signals
   */
  failureSignals: [
    'Episode ends in stability',
    'No reversal in 5+ episodes',
    'Relationship map static',
    'Lead solves problem without cost',
    'Magic used as solution instead of complication',
    'Dialogue explains world instead of advancing conflict',
  ],
} as const;

// =============================================================================
// VISUAL-NARRATIVE ALIGNMENT
// =============================================================================

/**
 * Maps story system rules to brand-system visual rules
 */
export const VISUAL_NARRATIVE_ALIGNMENT = {
  /**
   * Brand visual law → Narrative requirement
   */
  mappings: {
    'chiaroscuro': {
      visualRule: 'Gold vs black contrast',
      narrativeRule: 'Power vs vulnerability contrast in every scene',
    },
    'grime-standard': {
      visualRule: 'Tactile texture required',
      narrativeRule: 'Routine details as world truth (TACTILE_TRUTH promise)',
    },
    'close-range-acting': {
      visualRule: 'Favor eye-line shifts, throat movement, hand pressure',
      narrativeRule: 'Intimacy has consequences (POWER_INTIMACY promise)',
    },
    'magic-visibility': {
      visualRule: 'Magic visible on phone screen',
      narrativeRule: 'Magic must complicate, not solve',
    },
  },
} as const;

// =============================================================================
// BUILD SEQUENCE
// =============================================================================

/**
 * Recommended order for building a BLACKFEATHER project
 */
export const BUILD_SEQUENCE = [
  '1. Complete character builder templates',
  '2. Write one-sentence positioning + one-page concept',
  '3. Choose core magic model and cost structure',
  '4. Map lead–Architect relationship arc',
  '5. Map at least one secondary relationship arc',
  '6. Map one 3-5 episode micro-arc',
  '7. Map one season-scale macro-arc',
  '8. Draft ONLY the opening episode after all prior steps',
  '9. Test opening 10 seconds and ending 10 seconds',
  '10. Track reversals, leverage shifts, continuation questions',
] as const;

// =============================================================================
// EXPORTS
// =============================================================================

export type CorePromise = typeof CORE_PROMISES[keyof typeof CORE_PROMISES];
export type ReversalType = typeof REVERSAL_RULES.types[number];
export type CharacterRole = keyof typeof CHARACTER_ROLES;
export type MicroArcType = keyof typeof MICRO_ARC_TEMPLATES;
