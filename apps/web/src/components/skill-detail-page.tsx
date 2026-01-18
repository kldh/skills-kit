'use client'

import { SkillDetail } from './skill-detail';
import { FiltersSidebar } from './filters-sidebar';
import type { SkillWithStats } from '@/lib/skills.server';

interface SkillDetailPageProps {
  skill: SkillWithStats;
  tags: Array<string>;
  categories: Array<string>;
  currentCategory?: string;
  currentTag?: string;
  locale?: string;
}

export function SkillDetailPage({
  skill,
  tags,
  categories,
  currentCategory,
  currentTag,
  locale = 'en',
}: SkillDetailPageProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <FiltersSidebar
        categories={categories}
        tags={tags}
        currentCategory={currentCategory}
        currentTag={currentTag}
        locale={locale}
      />
      <div className="flex-1 lg:ml-64">
        <SkillDetail skill={skill} locale={locale} />
      </div>
    </div>
  );
}
