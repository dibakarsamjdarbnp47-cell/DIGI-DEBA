import React, { useState } from 'react';
import { Copy, Check, AlertCircle, BookmarkPlus, ArrowDown } from 'lucide-react';
import type {
  AutomationLabOutput,
  StudioId,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { generateStudioOutput } from '../utils/studioApi';
import { getUiText } from '../data/initialData';

interface AutomationLabProps {
  language: WorkspaceLanguage;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
}

export const AutomationLab: React.FC<AutomationLabProps> = ({
  language,
  onAddTaskToProject,
}) => {
  const ui = getUiText(language);
  const [platform, setPlatform] = useState('n8n (Self-Hosted or Cloud)');
  const [trigger, setTrigger] = useState('Website Contact / Order Form Webhook');
  const [objective, setObjective] = useState(
    'When a customer submits the website form, validate the payload, log the lead in Google Sheets, send a notification email to the team, and prepare an opt-in WhatsApp welcome message.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<AutomationLabOutput | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [savedToHub, setSavedToHub] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSavedToHub(false);

    const promptInput = `Automation Platform: ${platform}
Trigger Event: ${trigger}
Workflow Objective: ${objective}

Generate:
1. Workflow name & clear architecture summary.
2. Ordered step-by-step node pipeline (step number, node name, connected service, action, and data passed).
3. Realistic sample JSON webhook payload string.
4. Security, authentication, rate-limit, and error-handling checklist.`;

    try {
      const data = await generateStudioOutput<AutomationLabOutput>(
        'automation-lab',
        promptInput,
        language
      );
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate automation blueprint.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!output?.sampleWebhookPayloadJson) return;
    navigator.clipboard.writeText(output.sampleWebhookPayloadJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <form
        onSubmit={handleGenerate}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
            AI Automation &amp; Webhook Blueprints
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Design reliable workflows for n8n, Make, Zapier, and custom REST webhooks with payload schemas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Automation Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>n8n (Self-Hosted or Cloud)</option>
              <option>Make (Integromat)</option>
              <option>Zapier</option>
              <option>Custom Node.js / Express Webhook</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Trigger Source
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Website Contact / Order Form Webhook</option>
              <option>Incoming WhatsApp Business Message</option>
              <option>New YouTube Video or Podcast RSS Item</option>
              <option>Scheduled Daily Cron Trigger</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Connected Services &amp; Automation Logic
          </label>
          <textarea
            rows={3}
            required
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? ui.generating : 'Design Automation Blueprint'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-5 w-52 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-36 w-full bg-zinc-100 dark:bg-zinc-950 rounded-lg animate-pulse" />
        </div>
      )}

      {output && !loading && (
        <div className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {platform} · {trigger}
              </p>
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50 mt-1">
                {output.workflowName}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
                {output.architectureSummary}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddTaskToProject(
                  `Implement & test "${output.workflowName}" (${output.nodes.length} nodes)`,
                  '04. Execute',
                  'automation-lab'
                );
                setSavedToHub(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {savedToHub ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <BookmarkPlus className="w-3.5 h-3.5" />
              )}
              <span>{savedToHub ? 'Added to Hub' : ui.saveToProject}</span>
            </button>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Step-by-Step Node Flow */}
            <section className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50 mb-4">
                Execution Node Pipeline
              </h3>
              <div className="space-y-2">
                {output.nodes.map((node, idx) => (
                  <React.Fragment key={node.stepNumber}>
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-mono font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                          Node 0{node.stepNumber}
                        </span>
                        <span>{node.service}</span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                        {node.nodeName}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                        {node.action}
                      </p>
                      <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                        Payload: {node.dataPassed}
                      </p>
                    </div>
                    {idx < output.nodes.length - 1 && (
                      <div className="flex justify-center py-0.5 text-zinc-400">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* Sample Payload + Security Checklist */}
            <section className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                    Sample Webhook Payload
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                  >
                    {copiedJson ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedJson ? ui.copied : ui.copy}</span>
                  </button>
                </div>
                <pre className="p-4 bg-zinc-950 text-zinc-100 font-mono text-xs leading-relaxed overflow-x-auto">
                  <code>{output.sampleWebhookPayloadJson}</code>
                </pre>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-3">
                  Security &amp; Error Handling
                </h4>
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {output.errorHandlingAndSecurity.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
