// Import Node.js modules - these will be externalized by Vite for client builds
// The Vite config ensures these are not bundled for the browser
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to import generated skills data (available in build mode)
// This will be undefined if the file doesn't exist
let generatedSkillsData: ParsedSkill[] | null = null;

// Lazy load generated data
async function loadGeneratedData(): Promise<ParsedSkill[] | null> {
  if (generatedSkillsData !== null) {
    return generatedSkillsData;
  }
  
  try {
    const generated = await import("./skills-data.generated.js");
    generatedSkillsData = generated.skillsData;
    return generatedSkillsData;
  } catch {
    // Generated file doesn't exist, will use filesystem reads
    generatedSkillsData = null;
    return null;
  }
}

// Pre-load generated data if available (non-blocking)
loadGeneratedData().catch(() => {
  // Ignore errors, will fall back to filesystem
});

/**
 * Skill folder metadata from metadata.ts file
 */
export interface SkillFolderMetadata {
  /** Link to the skill (e.g., GitHub repo, documentation URL) */
  link?: string;
  /** Tags for categorization and search */
  tags?: string[];
  /** Category the skill belongs to */
  category?: string;
  /** Owner/maintainer of the skill */
  owner?: string;
  /** Original source URL or reference */
  originalSource?: string;
}

/**
 * Skill metadata from YAML frontmatter (merged with metadata.ts)
 */
export interface SkillMetadata {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  version?: string;
  license?: string;
  author?: string;
  /** Link to the skill (from metadata.ts) */
  link?: string;
  /** Owner/maintainer (from metadata.ts) */
  owner?: string;
  /** Original source URL (from metadata.ts) */
  originalSource?: string;
  [key: string]: unknown;
}

/**
 * Parsed skill file
 */
export interface ParsedSkill {
  metadata: SkillMetadata;
  content: string;
  path: string;
}

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match || !match[1] || !match[2]) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  // Simple YAML parser for basic key-value pairs
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value: unknown = trimmed.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (typeof value === "string") {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
    }

    // Handle arrays (simple format)
    if (typeof value === "string" && value.startsWith("-")) {
      const items = trimmed
        .slice(colonIndex + 1)
        .split("\n")
        .map((item) => item.trim().replace(/^-\s*/, "").replace(/['"]/g, ""));
      value = items.filter(Boolean);
    } else if (typeof value === "string" && value.includes(",")) {
      // Handle inline arrays
      value = value.split(",").map((item) => item.trim().replace(/['"]/g, ""));
    }

    // Handle boolean values
    if (value === "true") value = true;
    if (value === "false") value = false;

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Load metadata.ts file from a skill directory
 * Uses dynamic import to safely load the TypeScript file
 */
async function loadSkillMetadataAsync(skillDir: string): Promise<SkillFolderMetadata | null> {
  const metadataPath = join(skillDir, "metadata.ts");

  if (!existsSync(metadataPath)) {
    return null;
  }

  try {
    // Convert to file:// URL for import
    const fileUrl = `file://${metadataPath}`;
    const module = await import(fileUrl);
    
    // Support both "export const metadata" and "export default"
    const metadata = module.metadata || module.default;
    
    if (!metadata || typeof metadata !== "object") {
      return null;
    }

      return metadata as SkillFolderMetadata;
  } catch (error) {
    // If dynamic import fails (e.g., in build time), try reading and parsing
    try {
      const content = readFileSync(metadataPath, "utf-8");
      
      // Extract the export statement - look for "export const metadata" or "export default"
      const exportMatch = content.match(/export\s+(?:const\s+metadata|default)\s*[:=]\s*({[\s\S]*?});/);
      if (!exportMatch || !exportMatch[1]) {
        return null;
      }

      // Parse the object using a more robust approach
      const objStr = exportMatch[1];
      const metadata: SkillFolderMetadata = {};
      
      // Extract link
      const linkMatch = objStr.match(/link:\s*['"`]([^'"`]+)['"`]/);
      if (linkMatch) metadata.link = linkMatch[1];
      
      // Extract tags array (handles both single-line and multi-line)
      const tagsMatch = objStr.match(/tags:\s*\[([^\]]+)\]/s);
      if (tagsMatch && tagsMatch[1]) {
        const tagsStr = tagsMatch[1];
        metadata.tags = tagsStr
          .split(/[,\n]/)
          .map(t => t.trim().replace(/['"`]/g, "").replace(/^-\s*/, ""))
          .filter(Boolean);
      }
      
      // Extract category
      const categoryMatch = objStr.match(/category:\s*['"`]([^'"`]+)['"`]/);
      if (categoryMatch) metadata.category = categoryMatch[1];
      
      // Extract owner
      const ownerMatch = objStr.match(/owner:\s*['"`]([^'"`]+)['"`]/);
      if (ownerMatch) metadata.owner = ownerMatch[1];
      
      // Extract originalSource
      const sourceMatch = objStr.match(/originalSource:\s*['"`]([^'"`]+)['"`]/);
      if (sourceMatch) metadata.originalSource = sourceMatch[1];

      return metadata;
    } catch (parseError) {
      console.warn(`Error loading metadata.ts from ${skillDir}:`, parseError);
      return null;
    }
  }
}

/**
 * Synchronous version for use in loadSkill (will return null if metadata.ts exists,
 * actual loading happens in generate-skills-data.ts which can be async)
 */
function loadSkillMetadata(skillDir: string): SkillFolderMetadata | null {
  const metadataPath = join(skillDir, "metadata.ts");

  if (!existsSync(metadataPath)) {
    return null;
  }

  // For synchronous loader, we'll parse the file manually
  // The generate script will use the async version
  try {
    const content = readFileSync(metadataPath, "utf-8");
    
    // Extract the export statement - handle both with and without "as const"
    const exportMatch = content.match(/export\s+(?:const\s+metadata|default)\s*[:=]\s*({[\s\S]*?})(?:\s+as\s+const)?;/s);
    if (!exportMatch || !exportMatch[1]) {
      return null;
    }

    const objStr = exportMatch[1];
    const metadata: SkillFolderMetadata = {};
    
    // Extract link
    const linkMatch = objStr.match(/link:\s*['"`]([^'"`]+)['"`]/);
    if (linkMatch) metadata.link = linkMatch[1];
    
    // Extract tags array
    const tagsMatch = objStr.match(/tags:\s*\[([^\]]+)\]/s);
    if (tagsMatch && tagsMatch[1]) {
      const tagsStr = tagsMatch[1];
      metadata.tags = tagsStr
        .split(/[,\n]/)
        .map(t => t.trim().replace(/['"`]/g, "").replace(/^-\s*/, ""))
        .filter(Boolean);
    }
    
    // Extract category
    const categoryMatch = objStr.match(/category:\s*['"`]([^'"`]+)['"`]/);
    if (categoryMatch) metadata.category = categoryMatch[1];
    
    // Extract owner
    const ownerMatch = objStr.match(/owner:\s*['"`]([^'"`]+)['"`]/);
    if (ownerMatch) metadata.owner = ownerMatch[1];
    
    // Extract originalSource
    const sourceMatch = objStr.match(/originalSource:\s*['"`]([^'"`]+)['"`]/);
    if (sourceMatch) metadata.originalSource = sourceMatch[1];

    return metadata;
  } catch (error) {
    console.warn(`Error loading metadata.ts from ${skillDir}:`, error);
    return null;
  }
}

/**
 * Load a single skill from a directory
 */
export function loadSkill(skillDir: string): ParsedSkill | null {
  const skillPath = join(skillDir, "SKILL.md");

  try {
    const content = readFileSync(skillPath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    // Load metadata.ts if it exists
    const folderMetadata = loadSkillMetadata(skillDir);
    
    // Merge frontmatter with metadata.ts (metadata.ts takes precedence for overlapping fields)
    const mergedMetadata: SkillMetadata = {
      ...frontmatter,
      ...folderMetadata,
      // Preserve tags from frontmatter if metadata.ts doesn't have them, or merge them
      tags: folderMetadata?.tags || frontmatter.tags as string[] || [],
      // Preserve category from frontmatter if metadata.ts doesn't have it
      category: folderMetadata?.category || frontmatter.category as string,
    } as SkillMetadata;

    return {
      metadata: mergedMetadata,
      content: body,
      path: skillDir,
    };
  } catch (error) {
    console.error(`Error loading skill from ${skillDir}:`, error);
    return null;
  }
}

/**
 * Load all skills from the skills directory
 * Uses generated data in build mode, falls back to filesystem reads in dev mode
 */
export function loadAllSkills(skillsDir?: string): ParsedSkill[] {
  // If custom directory is provided, always use filesystem
  if (skillsDir) {
    const baseDir = skillsDir;
    const skills: ParsedSkill[] = [];

    try {
      const entries = readdirSync(baseDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillDir = join(baseDir, entry.name);
          const skill = loadSkill(skillDir);
          if (skill) {
            skills.push(skill);
          }
        }
      }
    } catch (error) {
      console.error(`Error loading skills from ${baseDir}:`, error);
    }

    return skills;
  }

  // Try to use generated data if already loaded
  if (generatedSkillsData) {
    return generatedSkillsData;
  }

  // Check if generated JSON file exists - if so, we're in build mode and should use it
  const generatedJsonPath = join(__dirname, "skills-data.generated.json");
  if (existsSync(generatedJsonPath)) {
    try {
      // Read and parse the generated JSON file
      const fileContent = readFileSync(generatedJsonPath, "utf-8");
      generatedSkillsData = JSON.parse(fileContent) as ParsedSkill[];
      return generatedSkillsData;
    } catch (error) {
      // If parsing fails, fall back to filesystem
      console.warn("Failed to load generated skills data, falling back to filesystem:", error);
    }
  }

  // Otherwise, read from filesystem (dev mode)
  const baseDir = join(__dirname, "..", "..", "skills");
  const skills: ParsedSkill[] = [];

  try {
    const entries = readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillDir = join(baseDir, entry.name);
        const skill = loadSkill(skillDir);
        if (skill) {
          skills.push(skill);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading skills from ${baseDir}:`, error);
  }

  return skills;
}

/**
 * Get skill by name
 */
export function getSkillByName(
  name: string,
  skillsDir?: string
): ParsedSkill | null {
  const skills = loadAllSkills(skillsDir);
  const found = skills.find((skill) => skill.metadata.name === name);
  return found || null;
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(
  category: string,
  skillsDir?: string
): ParsedSkill[] {
  const skills = loadAllSkills(skillsDir);
  return skills.filter(
    (skill) => skill.metadata.category?.toLowerCase() === category.toLowerCase()
  );
}
