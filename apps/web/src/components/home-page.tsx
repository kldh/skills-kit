import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  CodeIcon,
  CopyIcon,
  LayoutIcon,
  Tick02Icon,
  Download01Icon,
  PlayIcon,
} from '@hugeicons/core-free-icons';
import type { SkillWithStats } from '@/lib/skills.server';
import { getCategoryDisplayName } from '@/lib/i18n/astro';
import { buildUrl } from '@/lib/utils';
import { t } from '@/lib/i18n/messages';
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
          {t('view_all', locale)}{' '}
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
    const command = t('install_command', locale);
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
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl font-bold leading-0 text-balance">
              <span className="block bg-linear-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
                {t('hero_title', locale)}
              </span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
              {t('hero_subtitle', locale)}
            </h2>

            {/* Install Command and CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 px-6 py-4 bg-secondary/50 border border-border rounded-xl backdrop-blur-sm w-full sm:flex-1">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('install_via_cli', locale)}
                  </span>
                  <code className="text-sm font-mono text-foreground">
                    {t('install_command', locale)}
                  </code>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 px-3"
                  onClick={handleCopy}
                >
                  <HugeiconsIcon
                    icon={copied ? Tick02Icon : CopyIcon}
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="shrink-0 w-full sm:w-auto"
              >
                <a href={buildUrl('/skills', { locale })}>
                  {t('browse_skills', locale)}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

          </div>

          {/* Decorative Graphics - Scattered around like Family.co */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Left side decorations */}
            <div className="absolute left-[5%] top-[20%] w-32 h-32 bg-blue-400/20 rounded-full" />
            <div className="absolute left-[8%] top-[45%] w-24 h-24 bg-green-400/20 rounded-full" />
            <div className="absolute left-[12%] bottom-[25%] w-20 h-20 bg-yellow-400/20 rounded-full" />

            {/* Right side decorations */}
            <div className="absolute right-[8%] top-[15%] w-28 h-28 bg-orange-400/20 rounded-full" />
            <div className="absolute right-[5%] top-[50%] w-36 h-36 bg-purple-400/15 rounded-full" />
            <div className="absolute right-[10%] bottom-[20%] w-24 h-24 bg-pink-400/20 rounded-full" />

            {/* Center blur effects */}
            <div className="absolute left-1/4 top-1/3 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute right-1/4 top-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

            {/* Stars and sparkles */}
            <svg className="absolute left-[15%] top-[30%] w-8 h-8 text-yellow-400/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
            <svg className="absolute right-[18%] top-[35%] w-6 h-6 text-blue-400/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
            <svg className="absolute left-[20%] bottom-[30%] w-7 h-7 text-green-400/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
            <svg className="absolute right-[15%] bottom-[35%] w-5 h-5 text-purple-400/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>

            {/* Small dots */}
            <div className="absolute left-[25%] top-[25%] w-3 h-3 bg-orange-400/40 rounded-full" />
            <div className="absolute right-[25%] top-[28%] w-2 h-2 bg-blue-400/40 rounded-full" />
            <div className="absolute left-[30%] bottom-[40%] w-2.5 h-2.5 bg-green-400/40 rounded-full" />
            <div className="absolute right-[28%] bottom-[38%] w-3 h-3 bg-pink-400/40 rounded-full" />
          </div>
        </div>
      </section>

      <main className="container max-w-5xl mx-auto px-4 pb-20 space-y-12">
        {/* Featured Bar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t('featured_categories', locale)}
            </h3>
            <a
              href={buildUrl('/skills', { locale })}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
            >
              {t('view_all', locale)}
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
