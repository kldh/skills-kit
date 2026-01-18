import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  CodeIcon,
  CopyIcon,
  LayoutIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import type { SkillWithStats } from '@/lib/skills.server';
import { getCategoryDisplayName } from '@/lib/i18n/astro';
import { buildUrl } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  skills: Array<SkillWithStats>;
  categories: Array<string>;
  locale?: string;
}

function SkillCard({ skill, locale = 'en' }: { skill: any; locale?: string }) {
  const skillName = skill.metadata.name;
  const displayName = skillName
    .split('-')
    .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return (
    <a
      href={buildUrl(`/skills/${skillName}`, { locale })}
      className="group block"
    >
      <Card className="h-full bg-card/40 border-border/50 hover:border-primary/50 hover:bg-card/60 transition-all duration-200">
        <CardHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={CodeIcon} className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {displayName}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                {skill.metadata.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skill.metadata.tags?.slice(0, 2).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] py-0 px-1.5 h-5 bg-secondary/50 font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function SkillSection({
  title,
  skills,
  locale = 'en',
}: {
  title: string;
  skills: Array<any>;
  locale?: string;
}) {
  if (skills.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <a
          href={buildUrl('/skills', { locale })}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          View All{' '}
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.metadata.name} skill={skill} locale={locale} />
        ))}
      </div>
    </section>
  );
}

export function HomePage({ skills, categories, locale = 'en' }: HomePageProps) {
  const [copied, setCopied] = useState(false);

  // Get featured skills
  const featuredSkills = [...skills]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 4);

  // Group skills by category
  const skillsByCategory = categories.map((category) => ({
    name: category,
    skills: skills.filter((s) => s.metadata.category === category).slice(0, 4),
  }));

  const handleCopy = async () => {
    const command = 'npx add-skill kldh/skills-kit';
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Skills Kit
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                Discover and explore skills for AI agents
              </p>

              {/* Install Guide */}
              <div className="mt-8 flex items-center justify-center">
                <div className="bg-card border border-border rounded-xl px-6 py-4 shadow-lg flex items-center gap-4 group">
                  <code className="text-sm font-mono text-foreground">
                    npx add-skill kldh/skills-kit
                  </code>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleCopy}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={copied ? 'Copied!' : 'Copy command'}
                  >
                    <HugeiconsIcon
                      icon={copied ? Tick02Icon : CopyIcon}
                      className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container max-w-5xl mx-auto px-4 pb-20 space-y-12">
        {/* Featured Bar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Featured Categories
            </h3>
            <a
              href={buildUrl('/skills', { locale })}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
            >
              View All
            </a>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map((category) => (
              <a
                key={category}
                href={buildUrl('/skills', { locale })}
                className="flex flex-col items-center gap-2 p-3 min-w-[100px] rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HugeiconsIcon
                    icon={LayoutIcon}
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary"
                  />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-center">
                  {category}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Categorized Skills */}
        <div className="space-y-16">
          {skillsByCategory.map((cat) => (
            <SkillSection
              key={cat.name}
              title={getCategoryDisplayName(cat.name, locale)}
              skills={cat.skills}
              locale={locale}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
