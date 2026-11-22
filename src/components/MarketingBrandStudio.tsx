import React, { useState } from 'react';
import { Copy, Check, AlertCircle, BookmarkPlus } from 'lucide-react';
import type {
  BrandMarketingOutput,
  StudioId,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { generateStudioOutput } from '../utils/studioApi';
import { getUiText } from '../data/initialData';

interface MarketingBrandStudioProps {
  language: WorkspaceLanguage;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
}

export const MarketingBrandStudio: React.FC<MarketingBrandStudioProps> = ({
  language,
  onAddTaskToProject,
}) => {
  const ui = getUiText(language);
  const [brandName, setBrandName] = useState('Dhaka Craft Studio');
  const [platforms, setPlatforms] = useState('YouTube, Instagram, Facebook & LinkedIn');
  const [campaignGoal, setCampaignGoal] = useState('Product Launch & Organic Reach');
  const [brief, setBrief] = useState(
    'Modern sustainable stationery and handmade notebooks targeted at designers, students, and remote professionals.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<BrandMarketingOutput | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [savedToHub, setSavedToHub] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !brief.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSavedToHub(false);

    const promptInput = `Brand Name: ${brandName}
Target Social Platforms: ${platforms}
Campaign Goal: ${campaignGoal}
Product & Audience Brief: ${brief}

Create:
1. Brand visual direction, logo concept, typography pairing, and 4-color hex palette.
2. A high-detail AI image generation prompt for a YouTube thumbnail or promotional poster.
3. A 7-day multi-platform content calendar across ${platforms}.
4. High-intent SEO keywords and platform hashtags.`;

    try {
      const data = await generateStudioOutput<BrandMarketingOutput>(
        'brand-marketing',
        promptInput,
        language
      );
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate brand & marketing kit.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!output?.thumbnailOrPosterPrompt) return;
    navigator.clipboard.writeText(output.thumbnailOrPosterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <form
        onSubmit={handleGenerate}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
            Graphic Design, Branding &amp; Content Calendar
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Logo direction, palette specs, thumbnail prompts, 7-day social schedules, and SEO keyword clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Brand or Campaign Name
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Target Channels
            </label>
            <select
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>YouTube, Instagram, Facebook &amp; LinkedIn</option>
              <option>YouTube &amp; Shorts Focus</option>
              <option>Instagram Reels &amp; Facebook Page</option>
              <option>LinkedIn B2B &amp; Website SEO</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Campaign Objective
            </label>
            <select
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Product Launch &amp; Organic Reach</option>
              <option>Lead Generation &amp; Bookings</option>
              <option>Brand Awareness &amp; Authority</option>
              <option>Event Promotion &amp; Ticket Sales</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Product, Audience &amp; Aesthetic Brief
          </label>
          <textarea
            rows={2}
            required
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? ui.generating : 'Generate Brand & Marketing Plan'}
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
          <div className="h-40 w-full bg-zinc-100 dark:bg-zinc-950 rounded-lg animate-pulse" />
        </div>
      )}

      {output && !loading && (
        <div className="space-y-6">
          {/* Brand Identity & Swatches */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50">
                Visual Identity &amp; Design Direction
              </h3>
              <button
                type="button"
                onClick={() => {
                  onAddTaskToProject(
                    `Execute 7-day ${brandName} marketing & design rollout`,
                    '04. Execute',
                    'brand-marketing'
                  );
                  setSavedToHub(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {savedToHub ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <BookmarkPlus className="w-3.5 h-3.5" />
                )}
                <span>{savedToHub ? 'Added to Hub' : ui.saveToProject}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Brand Direction
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {output.brandDirection}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Logo Concept
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {output.logoConcept}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Typography Pairing
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {output.typographyPair}
                </p>
              </div>
            </div>

            {/* Color Palette Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              {output.colorPalette.map((swatch, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div
                    className="h-12 w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {swatch.role}
                    </span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400">
                      {swatch.hex}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{swatch.usage}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Thumbnail / Poster Prompt */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                Thumbnail / Promotional Poster AI Prompt
              </h3>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedPrompt ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedPrompt ? ui.copied : ui.copy}</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {output.thumbnailOrPosterPrompt}
            </pre>
          </section>

          {/* 7-Day Content Calendar Table */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50">
                7-Day Multi-Platform Content Calendar
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <th className="py-2.5 px-4 whitespace-nowrap">Day</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Platform</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Format</th>
                    <th className="py-2.5 px-4">Hook &amp; Topic</th>
                    <th className="py-2.5 px-4">Call to Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {output.contentCalendar.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-mono text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        {row.day}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">
                        {row.platform}
                      </td>
                      <td className="py-3 px-4 text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {row.format}
                      </td>
                      <td className="py-3 px-4 text-zinc-800 dark:text-zinc-200">
                        {row.hookAndTopic}
                      </td>
                      <td className="py-3 px-4 text-xs text-zinc-600 dark:text-zinc-400">
                        {row.cta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SEO Keywords & Hashtags (Zero-Pill Clean Lists) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-2">
                SEO Keywords
              </h4>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {output.seoKeywords.join(' · ')}
              </p>
            </section>

            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-2">
                Platform Hashtags
              </h4>
              <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {output.hashtags.join('  ')}
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
