import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { DigitalProject, StudioId, WorkflowPhase } from '../types/studio';
import { STUDIO_DIRECTORY, WORKFLOW_PHASES } from '../data/initialData';

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: DigitalProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [clientOrBrand, setClientOrBrand] = useState('');
  const [primaryStudio, setPrimaryStudio] = useState<StudioId>('web-architect');
  const [currentPhase, setCurrentPhase] = useState<WorkflowPhase>('01. Understand');
  const [summary, setSummary] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProj: DigitalProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      clientOrBrand: clientOrBrand.trim() || 'Internal Brand',
      primaryStudio,
      currentPhase,
      updatedAt: 'Just now',
      summary: summary.trim() || 'Created in DIGI DEBA Workspace.',
      tasks: [
        {
          id: `t-${Date.now()}`,
          title: 'Complete discovery brief & audience requirements',
          phase: '01. Understand',
          studio: primaryStudio,
          status: 'In Progress',
          dueDate: 'This week',
        },
      ],
    };

    onCreate(newProj);
    setTitle('');
    setClientOrBrand('');
    setSummary('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
            Create Digital Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., D2C Brand Website & Launch Reel"
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Client or Brand
              </label>
              <input
                type="text"
                value={clientOrBrand}
                onChange={(e) => setClientOrBrand(e.target.value)}
                placeholder="e.g., Studio Solis"
                className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Primary Studio
              </label>
              <select
                value={primaryStudio}
                onChange={(e) => setPrimaryStudio(e.target.value as StudioId)}
                className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {STUDIO_DIRECTORY.filter((s) => s.group === 'production').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Initial Workflow Phase
            </label>
            <select
              value={currentPhase}
              onChange={(e) => setCurrentPhase(e.target.value as WorkflowPhase)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {WORKFLOW_PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Objective &amp; Deliverables
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Outline target outcomes, budget constraints, and key channels..."
              className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
