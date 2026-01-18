'use client'

import { SkillsGallery } from './skills-gallery';
import { FiltersSidebar } from './filters-sidebar';
import type { SkillWithStats } from '@/lib/skills.server';

interface SkillsGalleryPageProps {
  skills: Array<SkillWithStats>;
  categories: Array<string>;
  tags: Array<string>;
  currentCategory?: string;
  currentTag?: string;
  locale?: string;
}

export function SkillsGalleryPage({
  skills,
  categories,
  tags,
  currentCategory,
  currentTag,
  locale = 'en',
}: SkillsGalleryPageProps) {
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
        <SkillsGallery
          initialSkills={skills}
          initialCategories={categories}
          initialCategory={currentCategory}
          initialTag={currentTag}
          locale={locale}
        />
      </div>
    </div>
  );
}
