import React from 'react';
import { Menu, Plus } from 'lucide-react';
import type { StudioId, WorkspaceLanguage } from '../types/studio';
import { STUDIO_DIRECTORY, getUiText } from '../data/initialData';

interface TopBarProps {
  activeStudio: StudioId;
  language: WorkspaceLanguage;
  onOpenMobileMenu: () => void;
  onOpenNewProject: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeStudio,
  language,
  onOpenMobileMenu,
  onOpenNewProject,
}) => {
  const studio = STUDIO_DIRECTORY.find((s) => s.id === activeStudio) ?? STUDIO_DIRECTORY[0];
  const ui = getUiText(language);

  return (
    <header className="h-14 px-4 sm:px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-8 sticky top-0 z-30 shrink-0">
      {/* Zone 1 & 2: Breadcrumb navigation context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap shrink-0 hidden sm:inline">
            Workspace
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline" aria-hidden="true">
            /
          </span>
          <h1 className="font-display font-semibold text-zinc-900 dark:text-zinc-50 truncate">
            {language === 'bn' ? studio.labelBn : studio.labelEn}
          </h1>
        </div>
      </div>

      {/* Zone 3: Single Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          <span>{ui.newProject}</span>
        </button>
      </div>
    </header>
  );
};
