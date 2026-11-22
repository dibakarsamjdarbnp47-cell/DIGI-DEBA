import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  AlertCircle,
  BookmarkPlus,
} from 'lucide-react';
import type {
  StudioId,
  WebArchitectOutput,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { generateStudioOutput } from '../utils/studioApi';
import { getUiText } from '../data/initialData';

interface WebLaunchStudioProps {
  language: WorkspaceLanguage;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
}

export const WebLaunchStudio: React.FC<WebLaunchStudioProps> = ({
  language,
  onAddTaskToProject,
}) => {
  const ui = getUiText(language);
  const [siteName, setSiteName] = useState('Katha Digital Studio');
  const [siteType, setSiteType] = useState('Agency & Portfolio Website');
  const [techStack, setTechStack] = useState('React + Vite + Tailwind CSS');
  const [hostingTarget, setHostingTarget] = useState('Cloudflare Pages');
  const [brief, setBrief] = useState(
    'Design a crisp, high-converting agency website with hero, 3 core services, client case studies, pricing comparison, and a consultation booking form.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<WebArchitectOutput | null>(null);

  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [savedTasks, setSavedTasks] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim() || !brief.trim() || loading) return;

    setLoading(true);
    setError(null);
    setCheckedSteps({});
    setSavedTasks(false);

    const promptInput = `Brand/Site Name: ${siteName}
Website Type: ${siteType}
Preferred Tech Stack: ${techStack}
Target Hosting Platform: ${hostingTarget}
Requirements & Brief: ${brief}

Generate:
1. Architectural summary & recommended stack rationale.
2. Complete self-contained responsive HTML5 code (with <script src="https://cdn.tailwindcss.com"></script>) that visually represents the website cleanly with working navigation links, hero, services/features, and footer.
3. Page/route breakdown.
4. Practical launch & deployment checklist covering GitHub repo, DNS records, SSL setup, responsive testing, SEO, and security for ${hostingTarget}.`;

    try {
      const data = await generateStudioOutput<WebArchitectOutput>(
        'web-architect',
        promptInput,
        language
      );
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!output?.htmlPreviewCode) return;
    navigator.clipboard.writeText(output.htmlPreviewCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleDownloadHtml = () => {
    if (!output?.htmlPreviewCode) return;
    const blob = new Blob([output.htmlPreviewCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'website'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveChecklistToProject = () => {
    if (!output) return;
    onAddTaskToProject(
      `Launch ${siteName} on ${hostingTarget} (${output.launchChecklist.length} checks)`,
      '05. Test',
      'web-architect'
    );
    setSavedTasks(true);
  };

  const frameWidth =
    viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Configuration Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
              Website Design, Code &amp; Launch Architect
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Generate responsive HTML/Tailwind prototypes, route structures, and DNS/SSL deployment checklists.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Website / Brand Name
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Website Category
            </label>
            <select
              value={siteType}
              onChange={(e) => setSiteType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Business Website</option>
              <option>Agency &amp; Portfolio Website</option>
              <option>Product Landing Page</option>
              <option>E-Commerce Storefront</option>
              <option>Membership &amp; Course Platform</option>
              <option>SaaS Web Application</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Target Stack
            </label>
            <select
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>HTML5 + Tailwind CSS</option>
              <option>React + Vite + Tailwind CSS</option>
              <option>Next.js App Router</option>
              <option>WordPress / Headless CMS</option>
              <option>Python FastAPI + HTMX</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Hosting &amp; Deployment
            </label>
            <select
              value={hostingTarget}
              onChange={(e) => setHostingTarget(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Cloudflare Pages</option>
              <option>Vercel</option>
              <option>Netlify</option>
              <option>GitHub Pages</option>
              <option>Custom VPS + Nginx</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Design Goals, Sections &amp; Functionality
          </label>
          <textarea
            rows={3}
            required
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Note: DIGI DEBA prepares verified code and deployment checklists; connect your hosting account directly before publishing.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? ui.generating : 'Build Site & Launch Plan'}
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
          <div className="h-5 w-56 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-72 w-full bg-zinc-100 dark:bg-zinc-950 rounded-lg animate-pulse" />
        </div>
      )}

      {output && !loading && (
        <div className="space-y-6">
          {/* Architecture Summary */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50">
                Architecture &amp; Stack Plan
              </h3>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                {output.recommendedStack}
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {output.summary}
            </p>
          </section>

          {/* Live Responsive Preview & Source Code */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'code'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>HTML Source</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {viewMode === 'preview' && (
                  <div className="hidden sm:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setViewport('desktop')}
                      aria-label="Desktop viewport"
                      className={`p-1.5 rounded-md cursor-pointer ${
                        viewport === 'desktop'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewport('tablet')}
                      aria-label="Tablet viewport"
                      className={`p-1.5 rounded-md cursor-pointer ${
                        viewport === 'tablet'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewport('mobile')}
                      aria-label="Mobile viewport"
                      className={`p-1.5 rounded-md cursor-pointer ${
                        viewport === 'mobile'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? ui.copied : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export HTML</span>
                </button>
              </div>
            </div>

            {viewMode === 'preview' ? (
              <div className="p-4 bg-zinc-100 dark:bg-zinc-950 flex justify-center overflow-x-auto">
                <iframe
                  title="Generated Website Preview"
                  srcDoc={output.htmlPreviewCode}
                  sandbox="allow-scripts"
                  style={{ width: frameWidth }}
                  className="h-[520px] bg-white rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all"
                />
              </div>
            ) : (
              <pre className="p-5 bg-zinc-950 text-zinc-100 font-mono text-xs leading-relaxed overflow-x-auto max-h-[520px]">
                <code>{output.htmlPreviewCode}</code>
              </pre>
            )}
          </section>

          {/* Routes & Launch Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50 mb-4">
                Site Map &amp; Key Components
              </h3>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {output.pagesAndRoutes.map((page, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0">
                    <p className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                      {page.route}
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {page.purpose}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {page.keyComponents}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50">
                    Pre-Launch &amp; Deployment Checklist
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {Object.values(checkedSteps).filter(Boolean).length} of{' '}
                    {output.launchChecklist.length} verified
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveChecklistToProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {savedTasks ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  )}
                  <span>{savedTasks ? 'Added to Hub' : ui.saveToProject}</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {output.launchChecklist.map((item, idx) => {
                  const checked = !!checkedSteps[idx];
                  return (
                    <label
                      key={idx}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="mt-1 rounded border-zinc-300 text-blue-700 focus:ring-blue-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{item.category}</span>
                        </div>
                        <p
                          className={`text-sm font-medium mt-0.5 ${
                            checked
                              ? 'line-through text-zinc-400 dark:text-zinc-500'
                              : 'text-zinc-900 dark:text-zinc-100'
                          }`}
                        >
                          {item.step}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {item.details}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
