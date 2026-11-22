import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-zinc-900 dark:text-zinc-50">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[13px] text-zinc-800 dark:text-zinc-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400">
        <span className="font-mono">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const segments = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
      {segments.map((segment, segIdx) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const lines = segment.slice(3, -3).split('\n');
          const language = (lines[0] || '').trim();
          const code = lines.slice(1).join('\n');
          return <CodeBlock key={segIdx} code={code} language={language} />;
        }

        const lines = segment.split('\n');
        return (
          <div key={segIdx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lineIdx} className="text-base font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                    {renderInlineFormatting(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lineIdx} className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 pt-3">
                    {renderInlineFormatting(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lineIdx} className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 pt-3">
                    {renderInlineFormatting(trimmed.slice(2))}
                  </h2>
                );
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-1">
                    <span className="text-zinc-400 dark:text-zinc-500 select-none mt-0.5">•</span>
                    <span className="flex-1">{renderInlineFormatting(trimmed.slice(2))}</span>
                  </div>
                );
              }
              const numberedMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
              if (numberedMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-1">
                    <span className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400 tabular-nums mt-1 min-w-[1.5rem]">
                      {numberedMatch[1]}
                    </span>
                    <span className="flex-1">{renderInlineFormatting(numberedMatch[2])}</span>
                  </div>
                );
              }
              if (trimmed === '---') {
                return <hr key={lineIdx} className="border-zinc-200 dark:border-zinc-800 my-3" />;
              }

              return <p key={lineIdx}>{renderInlineFormatting(trimmed)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};
