import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse YAML frontmatter from markdown file
 * Supports nested metadata objects with tags as YAML arrays
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

  // Parse YAML with support for nested objects and arrays
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterText.split("\n");
  
  // Stack to track nested objects: [{obj, indent}]
  const stack: Array<{ obj: Record<string, unknown>; indent: number }> = [
    { obj: frontmatter, indent: -1 }
  ];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) {
      i++;
      continue;
    }
    
    // Calculate indentation
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1]!.length : 0;
    
    // Pop stack until we find the right parent
    while (stack.length > 1 && indent <= stack[stack.length - 1]!.indent) {
      stack.pop();
    }
    
    const currentObj = stack[stack.length - 1]!.obj;
    
    // Check if this is a list item
    if (trimmed.startsWith("-")) {
      i++;
      continue; // List items are handled when we encounter the key
    }
    
    // Parse key-value pair
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) {
      i++;
      continue;
    }
    
    const key = trimmed.slice(0, colonIndex).trim();
    let value: unknown = trimmed.slice(colonIndex + 1).trim();
    
    // Remove quotes if present
    if (typeof value === "string") {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = (value as string).slice(1, -1);
      }
    }
    
    // Check what comes next to determine the type
    if (value === "" && i + 1 < lines.length) {
      const nextLine = lines[i + 1]!;
      const nextTrimmed = nextLine.trim();
      const nextIndentMatch = nextLine.match(/^(\s*)/);
      const nextIndent = nextIndentMatch ? nextIndentMatch[1]!.length : 0;
      
      // If next line is more indented
      if (nextIndent > indent) {
        // If next line starts with "-", it's an array
        if (nextTrimmed.startsWith("-")) {
          const items: string[] = [];
          i++; // Move to first item
          
          while (i < lines.length) {
            const itemLine = lines[i]!;
            const itemTrimmed = itemLine.trim();
            const itemIndentMatch = itemLine.match(/^(\s*)/);
            const itemIndent = itemIndentMatch ? itemIndentMatch[1]!.length : 0;
            
            // Stop if we go back to same or less indent level with non-list content
            if (itemIndent <= indent && itemTrimmed && !itemTrimmed.startsWith("-")) {
              break;
            }
            
            // Stop if we hit a less indented non-empty line that's not a list item
            if (itemIndent < nextIndent && itemTrimmed && !itemTrimmed.startsWith("-")) {
              break;
            }
            
            if (itemTrimmed.startsWith("-")) {
              const itemValue = itemTrimmed.slice(1).trim().replace(/^['"]|['"]$/g, "");
              if (itemValue) {
                items.push(itemValue);
              }
            }
            i++;
          }
          
          currentObj[key] = items;
          continue;
        } else {
          // It's a nested object
          const nestedObj: Record<string, unknown> = {};
          currentObj[key] = nestedObj;
          stack.push({ obj: nestedObj, indent: indent });
          i++;
          continue;
        }
      }
    }
    
    // Handle boolean values
    if (value === "true") value = true;
    if (value === "false") value = false;
    
    currentObj[key] = value;
    i++;
  }

  return { frontmatter, body };
}

/**
 * Flatten nested metadata into top-level metadata fields
 */
function flattenMetadata(frontmatter: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...frontmatter };
  
  // If there's a metadata object, flatten its properties to top level
  if (result.metadata && typeof result.metadata === "object") {
    const metadata = result.metadata as Record<string, unknown>;
    for (const [key, value] of Object.entries(metadata)) {
      // Don't overwrite existing top-level keys
      if (!(key in result)) {
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * Load a single skill from a directory
 */
function loadSkill(skillDir: string): { metadata: Record<string, unknown>; content: string; path: string } | null {
  const skillPath = join(skillDir, "SKILL.md");

  try {
    const content = readFileSync(skillPath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    // Flatten metadata to top level
    const flatMetadata = flattenMetadata(frontmatter);

    return {
      metadata: flatMetadata,
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
 */
function loadAllSkills(): Array<{ metadata: Record<string, unknown>; content: string; path: string }> {
  const baseDir = join(__dirname, "..", "skills");
  const skills: Array<{ metadata: Record<string, unknown>; content: string; path: string }> = [];

  try {
    const entries = readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== "node_modules") {
        const skillDir = join(baseDir, entry.name);
        const skill = loadSkill(skillDir);
        if (skill) {
          skills.push(skill);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading skills from ${baseDir}:`, error);
    throw error;
  }

  return skills;
}

/**
 * Generate skills data file
 */
async function generateSkillsData() {
  console.log("Generating skills data...");
  
  const skills = loadAllSkills();
  
  // Generate TypeScript file for type checking
  const tsOutput = `// This file is auto-generated by scripts/generate-skills-data.ts
// Do not edit this file manually

import type { ParsedSkill } from "./loader.js";

export const skillsData: ParsedSkill[] = ${JSON.stringify(skills, null, 2)} as ParsedSkill[];

export function getSkillsData(): ParsedSkill[] {
  return skillsData;
}
`;

  // Generate JSON file for easy synchronous loading
  const jsonOutput = JSON.stringify(skills, null, 2);

  const { writeFile, mkdir } = await import("fs/promises");
  
  const srcDir = join(__dirname, "..", "src");
  const distDir = join(__dirname, "..", "dist");
  
  const tsOutputPath = join(srcDir, "skills-data.generated.ts");
  const jsonOutputPathSrc = join(srcDir, "skills-data.generated.json");
  const jsonOutputPathDist = join(distDir, "skills-data.generated.json");
  
  // Ensure dist directory exists
  await mkdir(distDir, { recursive: true });
  
  // Write TypeScript file to src
  await writeFile(tsOutputPath, tsOutput, "utf-8");
  
  // Write JSON file to both src (for dev) and dist (for build)
  await writeFile(jsonOutputPathSrc, jsonOutput, "utf-8");
  await writeFile(jsonOutputPathDist, jsonOutput, "utf-8");
  
  console.log(`✓ Generated skills data files:`);
  console.log(`  - ${tsOutputPath}`);
  console.log(`  - ${jsonOutputPathSrc}`);
  console.log(`  - ${jsonOutputPathDist}`);
  console.log(`✓ Loaded ${skills.length} skills`);
}

generateSkillsData().catch((error) => {
  console.error("Error generating skills data:", error);
  process.exit(1);
});
