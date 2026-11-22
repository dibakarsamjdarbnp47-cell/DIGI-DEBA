import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Copy,
  Check,
  BookmarkPlus,
  RotateCcw,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import type {
  ChatMessage,
  DigitalProject,
  StudioId,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { QUICK_STARTER_PROMPTS, WORKFLOW_PHASES, getUiText } from '../data/initialData';
import { MarkdownView } from './MarkdownView';

interface CommandStudioProps {
  language: WorkspaceLanguage;
  activeProject: DigitalProject;
  onUpdateProjectPhase: (phase: WorkflowPhase) => void;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
  onNavigateStudio: (studio: StudioId) => void;
}

export const CommandStudio: React.FC<CommandStudioProps> = ({
  language,
  activeProject,
  onUpdateProjectPhase,
  onAddTaskToProject,
  onNavigateStudio,
}) => {
  const ui = getUiText(language);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('digi_deba_chat_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content:
          language === 'bn'
            ? `স্বাগতম! আমি **DIGI DEBA** — আপনার সমন্বিত এআই ডিজিটাল পার্টনার। ওয়েবসাইট ডিজাইন ও লঞ্চ, এআই ভিডিও প্রম্পট, পডকাস্ট প্রোডাকশন, হোয়াটসঅ্যাপ ওয়ার্কফ্লো, ডিজিটাল মার্কেটিং এবং অটোমেশন পরিকল্পনায় আমি আপনাকে সাহায্য করতে প্রস্তুত।\n\nআমরা এখন **${activeProject.title}** প্রজেক্টের **${activeProject.currentPhase}** ধাপে কাজ করছি। আজ কোন কাজটি শুরু করতে চান?`
            : `Welcome. I am **DIGI DEBA**, your unified AI digital creative and execution partner. I can help you plan, build, script, automate, and launch websites, AI video prompts, podcasts, WhatsApp Business workflows, marketing campaigns, and project roadmaps.\n\nActive project: **${activeProject.title}** (${activeProject.currentPhase}). Describe your objective or select a capability below to begin.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedTaskMsgId, setSavedTaskMsgId] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('digi_deba_chat_v1', JSON.stringify(messages.slice(-30)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textOverride?: string) => {
    const promptText = (textOverride ?? input).trim();
    if (!promptText || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textOverride) setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          activeProject: {
            title: activeProject.title,
            stage: activeProject.currentPhase,
            module: activeProject.primaryStudio,
          },
          messages: nextHistory.slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to get response from DIGI DEBA.');
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: payload.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    const fresh: ChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? `নতুন সেশন শুরু হয়েছে। **${activeProject.title}** প্রজেক্টের জন্য আপনার পরবর্তী নির্দেশনা দিন।`
            : `New session started for **${activeProject.title}** (${activeProject.currentPhase}). What would you like to plan or execute next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(fresh);
    setError(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSaveDeliverable = (msg: ChatMessage) => {
    const firstLine = msg.content.split('\n').find((l) => l.trim().length > 0) || 'AI Deliverable';
    const cleanTitle = firstLine.replace(/^[#*\-\s]+/, '').slice(0, 80);
    onAddTaskToProject(cleanTitle, activeProject.currentPhase, activeProject.primaryStudio);
    setSavedTaskMsgId(msg.id);
    setTimeout(() => setSavedTaskMsgId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Section 1: 7-Step Working Process Tracker */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50 text-balance">
              {activeProject.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {activeProject.clientOrBrand} · {activeProject.tasks.length} tracked tasks · 7-Step Execution Pipeline
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateStudio('projects')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Project Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {WORKFLOW_PHASES.map((phase, idx) => {
            const currentIdx = WORKFLOW_PHASES.indexOf(activeProject.currentPhase);
            const isCurrent = phase === activeProject.currentPhase;
            const isPast = idx < currentIdx;

            return (
              <button
                key={phase}
                type="button"
                onClick={() => onUpdateProjectPhase(phase)}
                className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-700 border-blue-700 text-white dark:bg-blue-600 dark:border-blue-600'
                    : isPast
                    ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="block text-[11px] font-mono tabular-nums opacity-80">
                  Step 0{idx + 1}
                </span>
                <span className="block text-xs font-medium truncate mt-0.5">
                  {phase.replace(/^\d+\.\s*/, '')}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Main Conversational Command Workspace + Quick Starters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Conversation Panel */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col min-h-[540px] max-h-[72vh]">
          <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0">
            <div>
              <h2 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                DIGI DEBA Assistant
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bilingual English &amp; Bengali · Context-aware execution
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Thread</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {msg.role === 'user' ? 'You' : 'DIGI DEBA'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[92%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-700 text-white dark:bg-blue-600 text-[15px] leading-relaxed'
                      : 'bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <>
                      <MarkdownView content={msg.content} />
                      <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === msg.id ? ui.copied : ui.copy}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveDeliverable(msg)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-blue-700 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {savedTaskMsgId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <BookmarkPlus className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {savedTaskMsgId === msg.id ? 'Saved to Hub' : ui.saveToProject}
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="space-y-2.5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="h-3.5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0"
          >
            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  language === 'bn'
                    ? 'আপনার ডিজিটাল প্রজেক্ট, ওয়েবসাইট, ভিডিও প্রম্পট বা অটোমেশনের কথা লিখুন...'
                    : 'Describe a website, video prompt, podcast script, WhatsApp flow, or project plan...'
                }
                className="flex-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-10 px-4 rounded-lg inline-flex items-center gap-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{ui.send}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Quick Workflows & Dedicated Studio Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-1">
              Quick Execution Starters
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Run a structured prompt directly or open a dedicated production studio.
            </p>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {QUICK_STARTER_PROMPTS.map((starter) => (
                <button
                  key={starter.title}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessage(starter.prompt)}
                  className="w-full py-3 first:pt-1 last:pb-1 text-left group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {starter.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 shrink-0" />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {starter.studioTag}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50 mb-3">
              Jump to Specialized Studio
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'web-architect' as StudioId, label: 'Web & Launch Studio', desc: 'Live HTML preview & DNS checklist' },
                { id: 'video-prompt' as StudioId, label: 'Video & AI Prompts', desc: 'Veo, Runway, Kling & editing plan' },
                { id: 'podcast-producer' as StudioId, label: 'Podcast Producer', desc: 'Scripts, questions & show notes' },
                { id: 'whatsapp-comms' as StudioId, label: 'WhatsApp & Comms', desc: 'Compliant chat & FAQ workflows' },
                { id: 'brand-marketing' as StudioId, label: 'Brand & Marketing', desc: 'Content calendar & SEO strategy' },
                { id: 'automation-lab' as StudioId, label: 'Automation Lab', desc: 'n8n, Make & webhook blueprints' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateStudio(item.id)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.label}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
