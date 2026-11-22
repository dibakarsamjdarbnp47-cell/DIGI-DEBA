import React from 'react';
import {
  TerminalSquare,
  FolderKanban,
  Globe,
  Clapperboard,
  Mic,
  MessageSquare,
  Palette,
  Workflow,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import type { DigitalProject, StudioId, WorkspaceLanguage } from '../types/studio';
import { STUDIO_DIRECTORY, getUiText } from '../data/initialData';

interface SidebarProps {
  activeStudio: StudioId;
  onSelectStudio: (id: StudioId) => void;
  language: WorkspaceLanguage;
  onChangeLanguage: (lang: WorkspaceLanguage) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  projects: DigitalProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const STUDIO_ICONS: Record<StudioId, React.ComponentType<{ className?: string }>> = {
  command: TerminalSquare,
  projects: FolderKanban,
  'web-architect': Globe,
  'video-prompt': Clapperboard,
  'podcast-producer': Mic,
  'whatsapp-comms': MessageSquare,
  'brand-marketing': Palette,
  'automation-lab': Workflow,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeStudio,
  onSelectStudio,
  language,
  onChangeLanguage,
  theme,
  onToggleTheme,
  projects,
  activeProjectId,
  onSelectProject,
  mobileOpen,
  onCloseMobile,
}) => {
  const ui = getUiText(language);
  const coreStudios = STUDIO_DIRECTORY.filter((s) => s.group === 'core');
  const productionStudios = STUDIO_DIRECTORY.filter((s) => s.group === 'production');

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Brand Lockup */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={() => {
            onSelectStudio('command');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" className="fill-blue-700 dark:fill-blue-600" />
            <path
              d="M7.5 7.5H11.5C13.9853 7.5 16 9.51472 16 12C16 14.4853 13.9853 16.5 11.5 16.5H7.5V7.5Z"
              stroke="white"
              strokeWidth="2"
            />
            <path d="M10.5 10.5H12C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5H10.5V10.5Z" fill="white" />
          </svg>
          <span className="font-display font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50 whitespace-nowrap shrink-0">
            DIGI DEBA
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="lg:hidden p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Project Selector */}
      <div className="px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
        <label
          htmlFor="active-project-select"
          className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5"
        >
          {ui.activeProjectLabel}
        </label>
        <select
          id="active-project-select"
          value={activeProjectId}
          onChange={(e) => onSelectProject(e.target.value)}
          className="w-full h-9 px-2.5 text-xs font-medium rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 truncate"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Workspace studios">
        <div>
          <p className="px-2.5 mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {ui.coreGroup}
          </p>
          <div className="space-y-1">
            {coreStudios.map((studio) => {
              const Icon = STUDIO_ICONS[studio.id];
              const isActive = activeStudio === studio.id;
              return (
                <button
                  key={studio.id}
                  type="button"
                  onClick={() => {
                    onSelectStudio(studio.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 h-10 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                  <span className="truncate">{language === 'bn' ? studio.labelBn : studio.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-2.5 mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {ui.studiosGroup}
          </p>
          <div className="space-y-1">
            {productionStudios.map((studio) => {
              const Icon = STUDIO_ICONS[studio.id];
              const isActive = activeStudio === studio.id;
              return (
                <button
                  key={studio.id}
                  type="button"
                  onClick={() => {
                    onSelectStudio(studio.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 h-10 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                  <span className="truncate">{language === 'bn' ? studio.labelBn : studio.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Workspace Controls (Language & Theme) */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{ui.languageLabel}</span>
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            {(['en', 'bn', 'bilingual'] as WorkspaceLanguage[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChangeLanguage(opt)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === opt
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {opt === 'en' ? 'EN' : opt === 'bn' ? 'বাংলা' : 'EN+BN'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{ui.themeLabel}</span>
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">{navContent}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[85vw] h-full z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};
