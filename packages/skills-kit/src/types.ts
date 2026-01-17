/**
 * Skill parameter definition
 */
export interface SkillParameter {
  /** Parameter name */
  name: string;
  /** Parameter type (string, number, boolean, object, array) */
  type: "string" | "number" | "boolean" | "object" | "array";
  /** Parameter description */
  description: string;
  /** Whether the parameter is required */
  required?: boolean;
  /** Default value if not provided */
  default?: unknown;
  /** Enum values if applicable */
  enum?: string[] | number[];
  /** Schema for object/array types */
  schema?: Record<string, unknown>;
}

/**
 * Skill definition interface
 */
export interface SkillDefinition {
  /** Unique identifier for the skill */
  id: string;
  /** Human-readable name of the skill */
  name: string;
  /** Detailed description of what the skill does */
  description: string;
  /** Category or domain the skill belongs to */
  category?: string;
  /** Tags for easier discovery */
  tags?: string[];
  /** Input parameters the skill accepts */
  parameters?: SkillParameter[];
  /** Output schema describing what the skill returns */
  output?: {
    type: "string" | "number" | "boolean" | "object" | "array";
    format?: "markdown" | "plain" | "json" | "html";
    schema?: Record<string, unknown>;
  };
  /** Example usage */
  examples?: Array<{
    input: Record<string, unknown>;
    output: unknown;
    description?: string;
  }>;
  /** Version of the skill */
  version?: string;
  /** Author or maintainer */
  author?: string;
  /** Whether the skill requires authentication */
  requiresAuth?: boolean;
  /** Rate limiting information */
  rateLimit?: {
    requests: number;
    period: "second" | "minute" | "hour" | "day";
  };
}

/**
 * Skill execution context
 */
export interface SkillContext {
  /** User ID or session ID */
  userId?: string;
  /** Authentication token if required */
  authToken?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Skill execution result
 */
export interface SkillResult<T = unknown> {
  /** Whether the execution was successful */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error message if execution failed */
  error?: string;
  /** Execution metadata */
  metadata?: {
    executionTime?: number;
    tokensUsed?: number;
    [key: string]: unknown;
  };
}

/**
 * Skill handler function type
 */
export type SkillHandler<TInput = Record<string, unknown>, TOutput = unknown> = (
  input: TInput,
  context?: SkillContext
) => Promise<SkillResult<TOutput>> | SkillResult<TOutput>;

/**
 * Complete skill with definition and handler
 */
export interface Skill<TInput = Record<string, unknown>, TOutput = unknown> {
  /** Skill definition */
  definition: SkillDefinition;
  /** Skill execution handler */
  handler: SkillHandler<TInput, TOutput>;
}
