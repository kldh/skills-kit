import type { Skill, SkillDefinition } from "./types.js";

/**
 * Internal registry of all registered skills
 */
const skillRegistry = new Map<string, Skill>();

/**
 * Register a skill in the registry
 */
export function registerSkill<TInput = Record<string, unknown>, TOutput = unknown>(
  skill: Skill<TInput, TOutput>
): void {
  if (skillRegistry.has(skill.definition.id)) {
    console.warn(
      `Skill with ID "${skill.definition.id}" is already registered. Overwriting...`
    );
  }
  skillRegistry.set(skill.definition.id, skill as Skill);
}

/**
 * Get a skill by its ID
 */
export function getSkill(id: string): Skill | undefined {
  return skillRegistry.get(id);
}

/**
 * Get all registered skills
 */
export function getAllSkills(): Skill[] {
  return Array.from(skillRegistry.values());
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: string): Skill[] {
  return getAllSkills().filter(
    (skill) => skill.definition.category === category
  );
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  getAllSkills().forEach((skill) => {
    if (skill.definition.category) {
      categories.add(skill.definition.category);
    }
  });
  return Array.from(categories);
}
