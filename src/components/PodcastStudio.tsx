import React, { useState } from 'react';
import { Copy, Check, AlertCircle, BookmarkPlus } from 'lucide-react';
import type {
  PodcastProducerOutput,
  StudioId,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { generateStudioOutput } from '../utils/studioApi';
import { getUiText } from '../data/initialData';

interface PodcastStudioProps {
  language: WorkspaceLanguage;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
}

export const PodcastStudio: React.FC<PodcastStudioProps> = ({
  language,
  onAddTaskToProject,
}) => {
  const ui = getUiText(language);
  const [topic, setTopic] = useState('How Independent Creators Can Build Automated Income Streams');
  const [format, setFormat] = useState('Host + Guest Interview');
  const [duration, setDuration] = useState('30 minutes');
  const [equipment, setEquipment] = useState('USB Microphone + Quiet Room');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<PodcastProducerOutput | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copiedScript, setCopiedScript] = useState(false);
  const [savedToHub, setSavedToHub] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setError(null);
    setCheckedItems({});
    setSavedToHub(false);

    const promptInput = `Podcast Topic: ${topic}
Episode Format: ${format}
Target Duration: ${duration}
Available Recording Equipment: ${equipment}

Generate:
1. 3 strong episode title options and an engaging episode description.
2. Host intro script and outro script.
3. Timestamped segment outline totaling ${duration}.
4. 6-8 thoughtful interview/discussion questions.
5. Promotional social captions (YouTube/LinkedIn/Instagram).
6. Recording, audio cleanup (tailored to ${equipment}), and publishing checklist.`;

    try {
      const data = await generateStudioOutput<PodcastProducerOutput>(
        'podcast-producer',
        promptInput,
        language
      );
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate podcast blueprint.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFullScript = () => {
    if (!output) return;
    const text = [
      `Titles:\n${output.episodeTitles.join('\n')}`,
      `\nDescription:\n${output.episodeDescription}`,
      `\nIntro Script:\n${output.introScript}`,
      `\nSegments:\n${output.segments.map((s) => `${s.timestamp} - ${s.title}: ${s.talkingPoints}`).join('\n')}`,
      `\nQuestions:\n${output.interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
      `\nOutro Script:\n${output.outroScript}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <form
        onSubmit={handleGenerate}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
            Podcast Episode &amp; Production Planner
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Episode outlines, host scripts, interview questions, promotional clips, and equipment-aware checklists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Episode Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Solo Episode</option>
              <option>Host + Guest Interview</option>
              <option>Co-Host Discussion</option>
              <option>Panel Roundtable</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Target Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Recording Equipment
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Smartphone + Quiet Room</option>
              <option>USB Microphone + Quiet Room</option>
              <option>XLR Mic + Audio Interface</option>
              <option>Video Podcast (Camera + Lav Mic)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Episode Topic &amp; Target Audience
          </label>
          <textarea
            rows={2}
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? ui.generating : 'Build Podcast Blueprint'}
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
          {/* Titles & Actions */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50">
                Recommended Episode Titles &amp; Show Notes
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyFullScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedScript ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedScript ? ui.copied : 'Copy Full Script'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddTaskToProject(
                      `Record & publish podcast: "${output.episodeTitles[0] || topic}"`,
                      '03. Create',
                      'podcast-producer'
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
            </div>

            <ul className="space-y-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {output.episodeTitles.map((title, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-zinc-400 tabular-nums">0{i + 1}.</span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 pt-2 border-t border-zinc-200 dark:border-zinc-800 leading-relaxed">
              {output.episodeDescription}
            </p>
          </section>

          {/* Outline & Scripts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5">
              <div>
                <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-2">
                  Host Intro Script
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {output.introScript}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-3">
                  Segment-by-Segment Run Sheet
                </h4>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {output.segments.map((seg, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                          {seg.timestamp}
                        </span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {seg.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                        {seg.talkingPoints}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-2">
                  Host Outro Script
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {output.outroScript}
                </p>
              </div>
            </section>

            <section className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-3">
                  Interview &amp; Discussion Questions
                </h4>
                <ol className="space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                  {output.interviewQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-zinc-400 tabular-nums mt-0.5">
                        {i + 1}.
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-3">
                  Recording &amp; Publishing Checklist
                </h4>
                <div className="space-y-2.5">
                  {output.recordingAndPublishingChecklist.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!checkedItems[idx]}
                        onChange={() =>
                          setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="mt-0.5 rounded border-zinc-300 text-blue-700 focus:ring-blue-600"
                      />
                      <span
                        className={
                          checkedItems[idx]
                            ? 'line-through text-zinc-400'
                            : 'text-zinc-700 dark:text-zinc-300'
                        }
                      >
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
