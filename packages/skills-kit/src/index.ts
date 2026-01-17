/**
 * Skills Kit - A collection of skills for AI agents
 * 
 * This package provides a standardized format for defining and executing
 * skills that AI agents can use to perform various tasks.
 * 
 * Skills are defined in SKILL.md files following the agent-skills specification:
 * https://agentskills.io/specification
 */

// Export TypeScript types and runtime handlers (legacy support)
export * from "./types.js";
export {
  registerSkill,
  getSkill,
  getAllSkills,
  getSkillsByCategory,
  getCategories,
} from "./registry.js";

// Export SKILL.md loader functions
export {
  loadSkill,
  loadAllSkills,
  getSkillByName,
  getSkillsByCategory as getSkillsByCategoryFromFiles,
  type SkillMetadata,
  type ParsedSkill,
} from "./loader.js";
