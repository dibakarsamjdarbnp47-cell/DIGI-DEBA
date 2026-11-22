import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
  Plus,
  Search,
  Trash2,
  Download,
} from 'lucide-react';
import type {
  DigitalProject,
  ProjectTask,
  StudioId,
  TaskStatus,
  WorkflowPhase,
} from '../types/studio';
import { STUDIO_DIRECTORY, WORKFLOW_PHASES } from '../data/initialData';

interface ProjectHubProps {
  projects: DigitalProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onUpdateProjectPhase: (phase: WorkflowPhase) => void;
  onAddTask: (title: string, phase: WorkflowPhase, studio: StudioId, dueDate: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const STATUS_FILTERS: Array<'All' | TaskStatus> = [
  'All',
  'In Progress',
  'Needs Approval',
  'Pending',
  'Completed',
];

function StatusIndicator({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Completed</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>In Progress</span>
        </span>
      );
    case 'Needs Approval':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Needs Approval</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <Circle className="w-3.5 h-3.5 shrink-0" />
          <span>Pending</span>
        </span>
      );
  }
}

export const ProjectHub: React.FC<ProjectHubProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onUpdateProjectPhase,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onDeleteProject,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0];
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<WorkflowPhase>(activeProject.currentPhase);
  const [newTaskStudio, setNewTaskStudio] = useState<StudioId>(activeProject.primaryStudio);
  const [newTaskDue, setNewTaskDue] = useState('Nov 28');

  const completedCount = activeProject.tasks.filter((t) => t.status === 'Completed').length;
  const approvalCount = activeProject.tasks.filter((t) => t.status === 'Needs Approval').length;
  const pendingCount = activeProject.tasks.filter(
    (t) => t.status === 'Pending' || t.status === 'In Progress'
  ).length;

  const filteredTasks = activeProject.tasks.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phase.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskPhase, newTaskStudio, newTaskDue.trim() || 'TBD');
    setNewTaskTitle('');
  };

  const handleExportMarkdown = () => {
    const lines = [
      `# ${activeProject.title}`,
      `Client / Brand: ${activeProject.clientOrBrand}`,
      `Current Phase: ${activeProject.currentPhase}`,
      '',
      `## Objective`,
      activeProject.summary,
      '',
      `## Task Breakdown`,
      ...activeProject.tasks.map(
        (t: ProjectTask) => `- [${t.status === 'Completed' ? 'x' : ' '}] (${t.phase}) ${t.title} — ${t.status} · Due ${t.dueDate}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Project Switcher & Metrics Strip */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{activeProject.clientOrBrand}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {activeProject.updatedAt}</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50 text-balance">
              {activeProject.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {activeProject.summary}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Brief</span>
            </button>
            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => onDeleteProject(activeProject.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Tabular Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Current Stage</p>
            <select
              value={activeProject.currentPhase}
              onChange={(e) => onUpdateProjectPhase(e.target.value as WorkflowPhase)}
              aria-label="Current workflow phase"
              className="mt-1 w-full h-9 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {WORKFLOW_PHASES.map((ph) => (
                <option key={ph} value={ph}>
                  {ph}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Completed Tasks</p>
            <p className="mt-1.5 text-2xl font-display font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {completedCount}
              <span className="text-sm font-normal text-zinc-400"> / {activeProject.tasks.length}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Pending &amp; Active</p>
            <p className="mt-1.5 text-2xl font-display font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {pendingCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Awaiting Approval</p>
            <p className="mt-1.5 text-2xl font-display font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {approvalCount}
            </p>
          </div>
        </div>
      </section>

      {/* Project Directory Strip (switch between projects cleanly) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectProject(p.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              p.id === activeProject.id
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Add Task Form + Task Table */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        {/* Filter & Search Toolbar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-x-auto">
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* High-Density Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <th className="py-2.5 px-4">Deliverable / Task</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Workflow Phase</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Studio</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Due</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No tasks match the current filter. Add a task below to organize your next milestone.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const studioMeta = STUDIO_DIRECTORY.find((s) => s.id === task.studio);
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {task.title}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {task.phase}
                      </td>
                      <td className="py-3 px-4 text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {studioMeta?.labelEn || task.studio}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {task.dueDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusIndicator status={task.status} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={task.status}
                            aria-label={`Change status for ${task.title}`}
                            onChange={(e) =>
                              onUpdateTaskStatus(task.id, e.target.value as TaskStatus)
                            }
                            className="h-8 px-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Needs Approval">Needs Approval</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => onDeleteTask(task.id)}
                            aria-label={`Delete ${task.title}`}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Add Task Row */}
        <form
          onSubmit={handleCreateTask}
          className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a deliverable, launch check, or approval item..."
            className="sm:col-span-5 h-9 px-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={newTaskPhase}
            onChange={(e) => setNewTaskPhase(e.target.value as WorkflowPhase)}
            className="sm:col-span-2 h-9 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-200"
          >
            {WORKFLOW_PHASES.map((ph) => (
              <option key={ph} value={ph}>
                {ph}
              </option>
            ))}
          </select>
          <select
            value={newTaskStudio}
            onChange={(e) => setNewTaskStudio(e.target.value as StudioId)}
            className="sm:col-span-2 h-9 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-200"
          >
            {STUDIO_DIRECTORY.filter((s) => s.group === 'production').map((s) => (
              <option key={s.id} value={s.id}>
                {s.labelEn}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTaskDue}
            onChange={(e) => setNewTaskDue(e.target.value)}
            placeholder="Due"
            className="sm:col-span-1 h-9 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-200"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="sm:col-span-2 h-9 px-3 rounded-lg inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </form>
      </section>
    </div>
  );
};
