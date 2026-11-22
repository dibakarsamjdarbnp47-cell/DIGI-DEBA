import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, type Schema } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const DIGI_DEBA_SYSTEM_PROMPT = `You are DIGI DEBA, an advanced AI-powered digital creative, development, media production, communication, and productivity assistant.
You combine the expertise of a Website Developer, UI/UX Designer, AI Prompt Engineer, Video Editor, Podcast Producer, Digital Marketing Assistant, Content Creator, Automation Specialist, and Digital Project Manager.

Core Operating Rules:
- Support both English and Bengali (বাংলা) fluently. Match the requested output language accurately.
- Follow the 7-Step Working Process: 01. Understand, 02. Plan, 03. Create, 04. Execute, 05. Test, 06. Improve, 07. Deliver.
- Be practical, concrete, structured, and solution-oriented. Provide ready-to-use code, prompts, scripts, checklists, and workflows.
- Recommend free or budget-friendly tools whenever suitable (Cloudflare Pages, Vercel, Netlify, DaVinci Resolve, CapCut, n8n self-hosted, etc.).
- Respect user privacy, WhatsApp Business policies, and consent requirements. Never claim a site is deployed or message was sent unless actually verified.
- Keep responses clear, well-organized, and directly actionable without filler.`;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatApiError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === 'GEMINI_API_KEY_MISSING' || msg.includes('API_KEY_INVALID') || msg.includes('API key')) {
    return {
      status: 400,
      message: 'Gemini API key is missing or invalid. Please check your key in the Settings > Secrets panel.',
    };
  }
  if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
    return {
      status: 403,
      message: 'Permission denied by Gemini API. Please verify your API key in Settings > Secrets.',
    };
  }
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
    return {
      status: 429,
      message: 'Rate limit or quota reached on the Gemini API. Please retry shortly or check your quota in Settings > Secrets.',
    };
  }
  return {
    status: 500,
    message: msg || 'An unexpected error occurred while generating the response.',
  };
}

function languageInstruction(lang: string): string {
  if (lang === 'bn') {
    return 'Write all prose, explanations, labels, scripts, and checklists in natural, fluent Bengali (বাংলা), while keeping technical identifiers, code, DNS records, JSON keys, and AI video prompt camera keywords clear.';
  }
  if (lang === 'bilingual') {
    return 'Provide outputs bilingually in both English and Bengali (বাংলা) clearly organized side by side or section by section.';
  }
  return 'Write all prose, plans, scripts, and checklists in clear, professional English.';
}

const STUDIO_SCHEMAS: Record<string, Schema> = {
  'web-architect': {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: 'Architectural overview and recommended stack rationale.' },
      recommendedStack: { type: Type.STRING, description: 'Recommended frontend/backend and hosting stack.' },
      htmlPreviewCode: {
        type: Type.STRING,
        description: 'Complete self-contained responsive HTML5 document using Tailwind CDN (<script src="https://cdn.tailwindcss.com"></script>) with clean modern layout, sections, hero, features, and footer.',
      },
      pagesAndRoutes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            route: { type: Type.STRING },
            purpose: { type: Type.STRING },
            keyComponents: { type: Type.STRING },
          },
        },
      },
      launchChecklist: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            step: { type: Type.STRING },
            category: { type: Type.STRING },
            details: { type: Type.STRING },
          },
        },
      },
    },
  },
  'video-prompt': {
    type: Type.OBJECT,
    properties: {
      conceptTitle: { type: Type.STRING },
      logline: { type: Type.STRING },
      visualStyleGuide: { type: Type.STRING },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sceneNumber: { type: Type.INTEGER },
            durationSeconds: { type: Type.INTEGER },
            shotType: { type: Type.STRING },
            aiVideoPrompt: { type: Type.STRING, description: 'Detailed ready-to-paste prompt for the selected AI video platform including subject, camera movement, lens, lighting, motion, and mood.' },
            voiceOver: { type: Type.STRING },
            subtitleText: { type: Type.STRING },
            transitionToNext: { type: Type.STRING },
          },
        },
      },
      editingTimeline: {
        type: Type.OBJECT,
        properties: {
          musicAndSfx: { type: Type.STRING },
          colorAndEffects: { type: Type.STRING },
          exportSettings: { type: Type.STRING },
        },
      },
    },
  },
  'podcast-producer': {
    type: Type.OBJECT,
    properties: {
      episodeTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
      episodeDescription: { type: Type.STRING },
      introScript: { type: Type.STRING },
      segments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.STRING },
            title: { type: Type.STRING },
            talkingPoints: { type: Type.STRING },
          },
        },
      },
      interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      outroScript: { type: Type.STRING },
      promoPosts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            copy: { type: Type.STRING },
          },
        },
      },
      recordingAndPublishingChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
  },
  'whatsapp-comms': {
    type: Type.OBJECT,
    properties: {
      workflowSummary: { type: Type.STRING },
      complianceNote: { type: Type.STRING },
      templates: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            trigger: { type: Type.STRING },
            messageText: { type: Type.STRING },
          },
        },
      },
      faqPairs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            automatedReply: { type: Type.STRING },
          },
        },
      },
      chatbotFlowSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
      integrationNotes: { type: Type.STRING },
    },
  },
  'brand-marketing': {
    type: Type.OBJECT,
    properties: {
      brandDirection: { type: Type.STRING },
      logoConcept: { type: Type.STRING },
      colorPalette: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            hex: { type: Type.STRING },
            usage: { type: Type.STRING },
          },
        },
      },
      typographyPair: { type: Type.STRING },
      thumbnailOrPosterPrompt: { type: Type.STRING },
      contentCalendar: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            platform: { type: Type.STRING },
            format: { type: Type.STRING },
            hookAndTopic: { type: Type.STRING },
            cta: { type: Type.STRING },
          },
        },
      },
      seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
  },
  'automation-lab': {
    type: Type.OBJECT,
    properties: {
      workflowName: { type: Type.STRING },
      architectureSummary: { type: Type.STRING },
      nodes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            stepNumber: { type: Type.INTEGER },
            nodeName: { type: Type.STRING },
            service: { type: Type.STRING },
            action: { type: Type.STRING },
            dataPassed: { type: Type.STRING },
          },
        },
      },
      sampleWebhookPayloadJson: { type: Type.STRING },
      errorHandlingAndSecurity: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
  },
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'digi-deba' });
  });

  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { messages, language = 'en', activeProject } = req.body as {
        messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
        language?: string;
        activeProject?: { title: string; stage: string; module: string } | null;
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Please provide a message to send to DIGI DEBA.' });
        return;
      }

      const ai = getGeminiClient();
      const contextLine = activeProject
        ? `\nActive Workspace Project: "${activeProject.title}" (Current Workflow Phase: ${activeProject.stage}, Primary Discipline: ${activeProject.module}).`
        : '';

      const systemInstruction = `${DIGI_DEBA_SYSTEM_PROMPT}\n\nLanguage Preference: ${languageInstruction(language)}${contextLine}`;

      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text?.trim() || 'No response generated. Please try refining your request.';
      res.json({ reply });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/ai/studio', async (req: Request, res: Response) => {
    try {
      const { studio, promptInput, language = 'en' } = req.body as {
        studio?: string;
        promptInput?: string;
        language?: string;
      };

      if (!studio || !STUDIO_SCHEMAS[studio]) {
        res.status(400).json({ error: 'Unknown studio module requested.' });
        return;
      }
      if (!promptInput || typeof promptInput !== 'string' || !promptInput.trim()) {
        res.status(400).json({ error: 'Please provide project brief details before generating.' });
        return;
      }

      const ai = getGeminiClient();
      const systemInstruction = `${DIGI_DEBA_SYSTEM_PROMPT}\n\nStudio Task: Generate a complete, high-craft structured output for the "${studio}" studio.\nLanguage Preference: ${languageInstruction(language)}\nEnsure all generated JSON fields are rich, practical, and directly usable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptInput,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: STUDIO_SCHEMAS[studio],
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);
      res.json({ data: parsed });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DIGI DEBA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start DIGI DEBA server:', err);
  process.exit(1);
});
