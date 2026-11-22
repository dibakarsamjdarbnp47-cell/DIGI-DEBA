import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  AlertCircle,
  BookmarkPlus,
  ShieldCheck,
  Phone,
  ExternalLink,
} from 'lucide-react';
import type {
  StudioId,
  WhatsAppCommsOutput,
  WorkflowPhase,
  WorkspaceLanguage,
} from '../types/studio';
import { generateStudioOutput } from '../utils/studioApi';
import { getUiText } from '../data/initialData';

interface WhatsAppStudioProps {
  language: WorkspaceLanguage;
  onAddTaskToProject: (title: string, phase: WorkflowPhase, studio: StudioId) => void;
}

export const WhatsAppStudio: React.FC<WhatsAppStudioProps> = ({
  language,
  onAddTaskToProject,
}) => {
  const ui = getUiText(language);
  const [businessName, setBusinessName] = useState('Bengal Artisan Roasters');
  const [workflowGoal, setWorkflowGoal] = useState('Customer Support, Order Updates & FAQ');
  const [tone, setTone] = useState('Warm, Polite & Professional');
  const [context, setContext] = useState(
    'Handle incoming customer inquiries about roast options, delivery timelines (2-4 days), bulk gifting orders, and polite opt-in confirmation.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<WhatsAppCommsOutput | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
  const [savedToHub, setSavedToHub] = useState(false);

  const [countryCode, setCountryCode] = useState(() => {
    try {
      const saved = localStorage.getItem('digi_deba_wa_country_v1');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '+91';
  });

  const [phoneInput, setPhoneInput] = useState(() => {
    try {
      const saved = localStorage.getItem('digi_deba_wa_phone_v1');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const [savedPhoneNotice, setSavedPhoneNotice] = useState(false);

  const sanitizedDigits = `${countryCode}${phoneInput}`.replace(/\D/g, '');
  const hasValidNumber = sanitizedDigits.length >= 10 && sanitizedDigits.length <= 15;

  useEffect(() => {
    try {
      localStorage.setItem('digi_deba_wa_country_v1', countryCode);
      localStorage.setItem('digi_deba_wa_phone_v1', phoneInput);
    } catch {
      // ignore
    }
  }, [countryCode, phoneInput]);

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidNumber) return;
    setSavedPhoneNotice(true);
    setTimeout(() => setSavedPhoneNotice(false), 2000);
  };

  const buildWaMeUrl = (messageText?: string) => {
    if (!hasValidNumber) return '#';
    const base = `https://wa.me/${sanitizedDigits}`;
    return messageText ? `${base}?text=${encodeURIComponent(messageText)}` : base;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !context.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSelectedTemplateIdx(0);
    setSavedToHub(false);

    const promptInput = `Business / Organization Name: ${businessName}
Workflow Goal: ${workflowGoal}
Communication Tone: ${tone}
Business Context & Scenarios: ${context}

Create:
1. Workflow summary & WhatsApp Business consent/opt-in compliance note.
2. 4 ready-to-use message templates (Welcome, Inquiry Reply, Follow-up, Update/Confirmation).
3. 5 structured FAQ question-and-reply pairs.
4. Step-by-step chatbot/automation decision flow.
5. Practical integration guidance connecting website forms or CRM with WhatsApp Business API.`;

    try {
      const data = await generateStudioOutput<WhatsAppCommsOutput>(
        'whatsapp-comms',
        promptInput,
        language
      );
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate WhatsApp workflow.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const activeTemplate = output?.templates[selectedTemplateIdx];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Phone Number & Connection Status Panel */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50">
              WhatsApp Number &amp; Click-to-Chat Configuration
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Save a number for local Click-to-Chat links. Live automated sending requires verified Meta WhatsApp Business Cloud API credentials.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap shrink-0">
            {hasValidNumber ? 'Click-to-Chat Ready · Cloud API Not Connected' : 'No Number Configured'}
          </span>
        </div>

        <form onSubmit={handleSavePhone} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Country Code
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-900 dark:text-zinc-100"
            >
              <option value="+91">+91 (India)</option>
              <option value="+880">+880 (Bangladesh)</option>
              <option value="+1">+1 (US / Canada)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+971">+971 (UAE)</option>
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Mobile Number (digits only)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                inputMode="numeric"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d\s-]/g, ''))}
                placeholder="Enter 10-digit mobile number"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={!hasValidNumber}
              className="h-10 px-4 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {savedPhoneNotice ? 'Saved Locally' : 'Save Number'}
            </button>

            {hasValidNumber && (
              <a
                href={buildWaMeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0"
              >
                <span>Test wa.me</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </form>

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <p className="font-medium text-zinc-800 dark:text-zinc-200">
            Requirements for Live WhatsApp Business API Automation:
          </p>
          <p>
            1. Register the number in Meta Business Manager (WhatsApp Business Platform) and complete OTP verification. 2. Provide a Phone Number ID, Business Account ID, and Webhook Verify Token as server-side secrets.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleGenerate}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50">
            WhatsApp Business Chat &amp; Workflow Designer
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Draft compliant message templates, FAQ chatbot trees, and customer follow-up sequences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Business / Brand Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Workflow Objective
            </label>
            <select
              value={workflowGoal}
              onChange={(e) => setWorkflowGoal(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Customer Support, Order Updates &amp; FAQ</option>
              <option>Welcome &amp; Lead Qualification</option>
              <option>Event Registration &amp; Reminders</option>
              <option>Appointment Booking &amp; Follow-up</option>
              <option>Opt-In Newsletter &amp; Launch Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Message Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option>Warm, Polite &amp; Professional</option>
              <option>Concise Direct Business</option>
              <option>Friendly Community Style</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Customer Scenarios, Products &amp; FAQ Topics
          </label>
          <textarea
            rows={2}
            required
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Generates drafts only — no automated messages are sent without explicit authorization.</span>
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? ui.generating : 'Build WhatsApp Workflows'}
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
          {/* Summary & Compliance */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {output.workflowSummary}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                Policy &amp; Consent Note: {output.complianceNote}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddTaskToProject(
                  `Review & approve ${businessName} WhatsApp Business templates`,
                  '04. Execute',
                  'whatsapp-comms'
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

          {/* Templates + Live Phone Chat Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800">
              {output.templates.map((tpl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTemplateIdx(idx)}
                  className={`p-5 cursor-pointer transition-colors ${
                    selectedTemplateIdx === idx
                      ? 'bg-blue-50/60 dark:bg-blue-950/20'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {tpl.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Trigger: {tpl.trigger}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {hasValidNumber && (
                        <a
                          href={buildWaMeUrl(tpl.messageText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0"
                        >
                          <span>Open Chat</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(idx, tpl.messageText);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {copiedIdx === idx ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedIdx === idx ? ui.copied : ui.copy}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {tpl.messageText}
                  </p>
                </div>
              ))}
            </section>

            {/* Realistic Chat Preview */}
            <section className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-emerald-800 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{businessName}</p>
                  <p className="text-[11px] text-emerald-100">Official Business Account Preview</p>
                </div>
              </div>
              <div className="p-4 bg-zinc-100 dark:bg-zinc-950 min-h-[260px] flex flex-col justify-end space-y-3">
                <div className="self-end max-w-[85%] rounded-xl rounded-tr-xs bg-emerald-700 text-white px-3.5 py-2.5 text-xs leading-relaxed">
                  Hi, I would like to know more about {activeTemplate?.trigger || 'your services'}.
                </div>
                {activeTemplate && (
                  <div className="self-start max-w-[90%] rounded-xl rounded-tl-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 px-3.5 py-2.5 text-xs whitespace-pre-wrap leading-relaxed shadow-xs">
                    {activeTemplate.messageText}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* FAQ & Chatbot Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50 mb-4">
                FAQ Auto-Response Matrix
              </h3>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {output.faqPairs.map((pair, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Q: {pair.question}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      {pair.automatedReply}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-50 mb-3">
                  Chatbot Flow Sequence
                </h3>
                <ol className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {output.chatbotFlowSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                        0{i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  API &amp; CRM Integration Notes
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {output.integrationNotes}
                </p>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
