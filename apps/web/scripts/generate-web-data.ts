import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SkillMetadata {
  name: string;
  description: string;
  metadata?: {
    category?: string;
    version?: string;
    tags?: string[];
    author?: string;
    owner?: string;
    originalSource?: string;
  };
  category?: string;
  version?: string;
  tags?: string[];
  author?: string;
  owner?: string;
  originalSource?: string;
}

interface ParsedSkill {
  metadata: SkillMetadata;
  content: string;
  path: string;
}

interface WebSkill extends ParsedSkill {
  installCount: number;
  trendingScore: number;
  createdAt: string;
  updatedAt: string;
}

interface SearchMapping {
  tags: Record<string, { count: number; skills: string[] }>;
  categories: Record<string, { count: number; skills: string[] }>;
}

/**
 * Generate random install count for demo purposes
 */
function generateInstallCount(): number {
  return Math.floor(Math.random() * 9000) + 100; // 100-9099
}

/**
 * Generate random trending score for demo purposes
 */
function generateTrendingScore(): number {
  return Math.floor(Math.random() * 100); // 0-99
}

/**
 * Generate random past date for demo purposes
 */
function generateRandomDate(startDays: number, endDays: number): string {
  const now = Date.now();
  const start = now - startDays * 24 * 60 * 60 * 1000;
  const end = now - endDays * 24 * 60 * 60 * 1000;
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString();
}

/**
 * Load skills from skills-kit package
 */
function loadSkills(): ParsedSkill[] {
  const skillsDataPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "packages",
    "skills-kit",
    "src",
    "skills-data.generated.json"
  );

  try {
    const data = readFileSync(skillsDataPath, "utf-8");
    return JSON.parse(data) as ParsedSkill[];
  } catch (error) {
    console.error(`Error loading skills data from ${skillsDataPath}:`, error);
    throw error;
  }
}

/**
 * Transform skills for web app with demo data
 */
function transformSkillsForWeb(skills: ParsedSkill[]): WebSkill[] {
  return skills.map((skill) => {
    const createdAt = generateRandomDate(300, 100); // 100-300 days ago
    const updatedAt = generateRandomDate(90, 0); // 0-90 days ago

    return {
      ...skill,
      installCount: generateInstallCount(),
      trendingScore: generateTrendingScore(),
      createdAt,
      updatedAt,
    };
  });
}

/**
 * Build search mapping from skills
 */
function buildSearchMapping(skills: WebSkill[]): SearchMapping {
  const tags: Record<string, { count: number; skills: string[] }> = {};
  const categories: Record<string, { count: number; skills: string[] }> = {};

  for (const skill of skills) {
    const skillName = skill.metadata.name;

    // Add tags
    const skillTags =
      skill.metadata.tags || skill.metadata.metadata?.tags || [];
    for (const tag of skillTags) {
      if (!tags[tag]) {
        tags[tag] = { count: 0, skills: [] };
      }
      tags[tag]!.count++;
      tags[tag]!.skills.push(skillName);
    }

    // Add category
    const category =
      skill.metadata.category || skill.metadata.metadata?.category;
    if (category) {
      if (!categories[category]) {
        categories[category] = { count: 0, skills: [] };
      }
      categories[category]!.count++;
      categories[category]!.skills.push(skillName);
    }
  }

  return { tags, categories };
}

/**
 * Generate web data files
 */
async function generateWebData() {
  console.log("Generating web app data files...");

  // Load skills from skills-kit
  const skills = loadSkills();
  console.log(`✓ Loaded ${skills.length} skills from @repo/skills-kit`);

  // Transform skills for web
  const webSkills = transformSkillsForWeb(skills);

  // Build search mapping
  const searchMapping = buildSearchMapping(webSkills);

  // Output paths
  const dataDir = join(__dirname, "..", "src", "data");
  const skillsJsonPath = join(dataDir, "skills.json");
  const searchMappingPath = join(dataDir, "search-mapping.json");

  // Write skills.json
  writeFileSync(skillsJsonPath, JSON.stringify(webSkills, null, 2), "utf-8");
  console.log(`✓ Generated ${skillsJsonPath}`);

  // Write search-mapping.json
  writeFileSync(
    searchMappingPath,
    JSON.stringify(searchMapping, null, 2),
    "utf-8"
  );
  console.log(`✓ Generated ${searchMappingPath}`);

  // Print summary
  console.log("\n📊 Summary:");
  console.log(`  - Skills: ${webSkills.length}`);
  console.log(`  - Tags: ${Object.keys(searchMapping.tags).length}`);
  console.log(
    `  - Categories: ${Object.keys(searchMapping.categories).length}`
  );
}

generateWebData().catch((error) => {
  console.error("Error generating web data:", error);
  process.exit(1);
});
