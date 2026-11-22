import { useState, useEffect } from 'react';
import type {
  DigitalProject,
  StudioId,
  TaskStatus,
  WorkflowPhase,
  WorkspaceLanguage,
} from './types/studio';
import { INITIAL_PROJECTS } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CommandStudio } from './components/CommandStudio';
import { ProjectHub } from './components/ProjectHub';
import { WebLaunchStudio } from './components/WebLaunchStudio';
import { VideoPromptStudio } from './components/VideoPromptStudio';
import { PodcastStudio } from './components/PodcastStudio';
import { WhatsAppStudio } from './components/WhatsAppStudio';
import { MarketingBrandStudio } from './components/MarketingBrandStudio';
import { AutomationLab } from './components/AutomationLab';
import { NewProjectModal } from './components/NewProjectModal';

export default function App() {
  const [activeStudio, setActiveStudio] = useState<StudioId>('command');
  const [language, setLanguage] = useState<WorkspaceLanguage>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('digi_deba_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const [projects, setProjects] = useState<DigitalProject[]>(() => {
    try {
      const saved = localStorage.getItem('digi_deba_projects_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => projects[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('digi_deba_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('digi_deba_projects_v1', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0];

  const handleUpdateProjectPhase = (phase: WorkflowPhase) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, currentPhase: phase, updatedAt: 'Just now' }
          : p
      )
    );
  };

  const handleAddTask = (
    title: string,
    phase: WorkflowPhase,
    studio: StudioId,
    dueDate = 'This week'
  ) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              updatedAt: 'Just now',
              tasks: [
                ...p.tasks,
                {
                  id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  title,
                  phase,
                  studio,
                  status: 'Pending',
                  dueDate,
                },
              ],
            }
          : p
      )
    );
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              updatedAt: 'Just now',
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, status } : t
              ),
            }
          : p
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              updatedAt: 'Just now',
              tasks: p.tasks.filter((t) => t.id !== taskId),
            }
          : p
      )
    );
  };

  const handleCreateProject = (project: DigitalProject) => {
    setProjects((prev) => [project, ...prev]);
    setActiveProjectId(project.id);
    setActiveStudio('projects');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => {
      const remaining = prev.filter((p) => p.id !== projectId);
      if (remaining.length > 0 && activeProjectId === projectId) {
        setActiveProjectId(remaining[0].id);
      }
      return remaining.length > 0 ? remaining : INITIAL_PROJECTS;
    });
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Sidebar
        activeStudio={activeStudio}
        onSelectStudio={setActiveStudio}
        language={language}
        onChangeLanguage={setLanguage}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        projects={projects}
        activeProjectId={activeProject.id}
        onSelectProject={setActiveProjectId}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeStudio={activeStudio}
          language={language}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNewProject={() => setNewProjectOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeStudio === 'command' && (
            <CommandStudio
              language={language}
              activeProject={activeProject}
              onUpdateProjectPhase={handleUpdateProjectPhase}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
              onNavigateStudio={setActiveStudio}
            />
          )}

          {activeStudio === 'projects' && (
            <ProjectHub
              projects={projects}
              activeProjectId={activeProject.id}
              onSelectProject={setActiveProjectId}
              onUpdateProjectPhase={handleUpdateProjectPhase}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeStudio === 'web-architect' && (
            <WebLaunchStudio
              language={language}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
            />
          )}

          {activeStudio === 'video-prompt' && (
            <VideoPromptStudio
              language={language}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
            />
          )}

          {activeStudio === 'podcast-producer' && (
            <PodcastStudio
              language={language}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
            />
          )}

          {activeStudio === 'whatsapp-comms' && (
            <WhatsAppStudio
              language={language}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
            />
          )}

          {activeStudio === 'brand-marketing' && (
            <MarketingBrandStudio
              language={language}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
            />
          )}

          {activeStudio === 'automation-lab' && (
            <AutomationLab
              language={language}
              onAddTaskToProject={(title, phase, studio) =>
                handleAddTask(title, phase, studio)
              }
            />
          )}
        </main>
      </div>

      <NewProjectModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
