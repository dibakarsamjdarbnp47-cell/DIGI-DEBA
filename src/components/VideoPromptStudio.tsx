import React, { useState } from 'react';
import { Copy, Check, AlertCircle, BookmarkPlus } from 'lucide-react';
import type {
  StudioId,
  VideoPromptOutput,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { generateStudioOutput } from '../utils/studioApi';
import { getUiText } from '../data/initialData';

interface VideoPromptStudioProps {
  language: WorkspaceLanguage;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
}

export const VideoPromptStudio: React.FC<VideoPromptStudioProps> = ({
  language,
  onAddTaskToProject,
}) => {
  const ui = getUiText(language);
  const [platform, setPlatform] = useState('Google Veo');
  const [aspectRatio, setAspectRatio] = useState('9:16 (Shorts / Reels)');
  const [style, setStyle] = useState('Cinematic Product Commercial');
  const [editor, setEditor] = useState('DaVinci Resolve');
  const [concept, setConcept] = useState(
    'A 24-second promotional video for an artisan tea harvest in Darjeeling, transitioning from misty mountain sunrise to pouring golden tea in a ceramic cup.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<VideoPromptOutput | null>(null);
  const [copiedScene, setCopiedScene] = useState<number | null>(null);
  const [savedToHub, setSavedToHub] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSavedToHub(false);

    const promptInput = `Target AI Video Platform: ${platform}
Aspect Ratio: ${aspectRatio}
Visual Style: ${style}
Post-Production Editor: ${editor}
Video Concept: ${concept}

Create a detailed 4-to-5 scene AI video prompt sequence ready to paste into ${platform}, complete with camera movement, lens/framing, lighting, motion physics, voice-over narration, subtitle text, transitions, and an editing timeline + export settings for ${editor}.`;

    try {
      const data = await generateStudioOutput<VideoPromptOutput>(
        'video-prompt',
        promptInput,
        language
      );
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video prompts.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = (sceneNumber: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScene(sceneNumber);
    setTimeout(() => setCopiedScene(null), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <form
        onSubmit={handleGenerate}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
            AI Video Prompt &amp; Post-Production Studio
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Scene-by-scene prompts for Veo, Runway, Kling &amp; Sora with voice-over, subtitles, and editing timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              AI Video Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Google Veo</option>
              <option>Runway Gen-4</option>
              <option>Kling AI</option>
              <option>OpenAI Sora</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>16:9 (YouTube / Web Hero)</option>
              <option>9:16 (Shorts / Reels)</option>
              <option>1:1 (Social Feed)</option>
              <option>4:5 (Instagram / LinkedIn)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Genre &amp; Visual Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Cinematic Product Commercial</option>
              <option>Documentary Realism</option>
              <option>Educational Explainer</option>
              <option>High-Pace Social Reel</option>
              <option>Event Recap &amp; Teaser</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Editing Tool
            </label>
            <select
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>DaVinci Resolve</option>
              <option>CapCut</option>
              <option>Adobe Premiere Pro</option>
              <option>Final Cut Pro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Story Concept, Mood &amp; Key Message
          </label>
          <textarea
            rows={3}
            required
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? ui.generating : 'Generate Storyboard & Prompts'}
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
          <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-950 rounded-lg animate-pulse" />
        </div>
      )}

      {output && !loading && (
        <div className="space-y-6">
          {/* Header Overview */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {platform} · {aspectRatio} · {editor}
                </p>
                <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50 mt-1">
                  {output.conceptTitle}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
                  {output.logline}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Visual Direction: {output.visualStyleGuide}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddTaskToProject(
                    `Produce & edit "${output.conceptTitle}" (${output.scenes.length} scenes)`,
                    '03. Create',
                    'video-prompt'
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
            </div>
          </section>

          {/* Scene-by-Scene Prompts */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800">
            {output.scenes.map((scene) => (
              <div key={scene.sceneNumber} className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      Scene 0{scene.sceneNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{scene.durationSeconds}s</span>
                    <span aria-hidden="true">·</span>
                    <span>{scene.shotType}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(scene.sceneNumber, scene.aiVideoPrompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedScene === scene.sceneNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {copiedScene === scene.sceneNumber ? ui.copied : 'Copy AI Prompt'}
                    </span>
                  </button>
                </div>

                <pre className="p-4 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {scene.aiVideoPrompt}
                </pre>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                  <div>
                    <span className="font-medium text-zinc-500 dark:text-zinc-400 block">
                      Voice-Over
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                      {scene.voiceOver}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-500 dark:text-zinc-400 block">
                      Subtitle / Caption
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                      {scene.subtitleText}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-500 dark:text-zinc-400 block">
                      Transition
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                      {scene.transitionToNext}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Post-Production Timeline Notes */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50 mb-4">
              Post-Production &amp; Export Plan ({editor})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Music &amp; Sound Design
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {output.editingTimeline.musicAndSfx}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Color Grading &amp; Motion Effects
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {output.editingTimeline.colorAndEffects}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Recommended Export Settings
                </p>
                <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {output.editingTimeline.exportSettings}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
