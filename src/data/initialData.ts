import type { DigitalProject, StudioId, WorkflowPhase, WorkspaceLanguage } from '../types/studio';

export const WORKFLOW_PHASES: WorkflowPhase[] = [
  '01. Understand',
  '02. Plan',
  '03. Create',
  '04. Execute',
  '05. Test',
  '06. Improve',
  '07. Deliver',
];

export interface StudioMeta {
  id: StudioId;
  group: 'core' | 'production';
  labelEn: string;
  labelBn: string;
  subtitleEn: string;
  subtitleBn: string;
}

export const STUDIO_DIRECTORY: StudioMeta[] = [
  {
    id: 'command',
    group: 'core',
    labelEn: 'Command Studio',
    labelBn: 'কমান্ড স্টুডিও',
    subtitleEn: 'Unified AI digital partner & 7-step execution engine',
    subtitleBn: 'সমন্বিত এআই ডিজিটাল পার্টনার ও ৭-ধাপ ওয়ার্কফ্লো',
  },
  {
    id: 'projects',
    group: 'core',
    labelEn: 'Project Hub',
    labelBn: 'প্রজেক্ট হাব',
    subtitleEn: 'Milestones, task breakdown, approvals & checklists',
    subtitleBn: 'প্রজেক্ট পরিকল্পনা, টাস্ক ও অগ্রগতি পরিচালনা',
  },
  {
    id: 'web-architect',
    group: 'production',
    labelEn: 'Web & Launch',
    labelBn: 'ওয়েব ও লঞ্চিং',
    subtitleEn: 'Responsive design, live HTML preview & DNS/SSL launch checklist',
    subtitleBn: 'ওয়েবসাইট ডিজাইন, কোড প্রিভিউ ও ডিপ্লয়মেন্ট চেকলিস্ট',
  },
  {
    id: 'video-prompt',
    group: 'production',
    labelEn: 'Video & AI Prompts',
    labelBn: 'ভিডিও ও এআই প্রম্পট',
    subtitleEn: 'Veo, Runway, Kling & Sora scene prompts + editing timeline',
    subtitleBn: 'দৃশ্যভিত্তিক এআই ভিডিও প্রম্পট ও এডিটিং টাইমলাইন',
  },
  {
    id: 'podcast-producer',
    group: 'production',
    labelEn: 'Podcast Producer',
    labelBn: 'পডকাস্ট প্রডিউসার',
    subtitleEn: 'Episode outlines, scripts, interview prep & publishing checklist',
    subtitleBn: 'পডকাস্ট স্ক্রিপ্ট, প্রশ্নাবলি ও পাবলিশিং ওয়ার্কফ্লো',
  },
  {
    id: 'whatsapp-comms',
    group: 'production',
    labelEn: 'WhatsApp & Comms',
    labelBn: 'হোয়াটসঅ্যাপ ও চ্যাট',
    subtitleEn: 'Business templates, FAQ bots & compliant customer flows',
    subtitleBn: 'বিজনেস মেসেজ টেমপ্লেট, এফএকিউ ও চ্যাটবট ফ্লো',
  },
  {
    id: 'brand-marketing',
    group: 'production',
    labelEn: 'Brand & Marketing',
    labelBn: 'ব্র্যান্ড ও মার্কেটিং',
    subtitleEn: 'Brand identity, thumbnails, 7-day calendar & SEO keywords',
    subtitleBn: 'লোগো ধারণা, কনটেন্ট ক্যালেন্ডার ও এসইও কীওয়ার্ড',
  },
  {
    id: 'automation-lab',
    group: 'production',
    labelEn: 'Automation Lab',
    labelBn: 'অটোমেশন ল্যাব',
    subtitleEn: 'n8n, Make & Zapier node blueprints, webhooks & payloads',
    subtitleBn: 'ওয়েবহুক, এপিআই ইন্টিগ্রেশন ও অটোমেশন ব্লুপ্রিন্ট',
  },
];

export const INITIAL_PROJECTS: DigitalProject[] = [
  {
    id: 'proj-01',
    title: 'Bengal Artisan Roasters Launch',
    clientOrBrand: 'Bengal Artisan Co.',
    primaryStudio: 'web-architect',
    currentPhase: '03. Create',
    updatedAt: 'Today, 17:10',
    summary: 'Full storefront landing page, Cloudflare Pages deployment, 30s Veo launch reel, and WhatsApp order confirmation flow.',
    tasks: [
      {
        id: 't-101',
        title: 'Define target audience, brand voice & bilingual storefront copy',
        phase: '01. Understand',
        studio: 'brand-marketing',
        status: 'Completed',
        dueDate: 'Nov 19',
      },
      {
        id: 't-102',
        title: 'Design responsive landing page & checkout inquiry route',
        phase: '03. Create',
        studio: 'web-architect',
        status: 'In Progress',
        dueDate: 'Nov 22',
      },
      {
        id: 't-103',
        title: 'Generate 4-scene Google Veo product launch reel & subtitles',
        phase: '03. Create',
        studio: 'video-prompt',
        status: 'Pending',
        dueDate: 'Nov 23',
      },
      {
        id: 't-104',
        title: 'Approve WhatsApp Business welcome & order status templates',
        phase: '04. Execute',
        studio: 'whatsapp-comms',
        status: 'Needs Approval',
        dueDate: 'Nov 24',
      },
      {
        id: 't-105',
        title: 'Verify DNS CNAME, SSL certificate & mobile Lighthouse checks',
        phase: '05. Test',
        studio: 'web-architect',
        status: 'Pending',
        dueDate: 'Nov 25',
      },
    ],
  },
  {
    id: 'proj-02',
    title: 'Founders Unscripted — Season 2',
    clientOrBrand: 'Creator Studio Network',
    primaryStudio: 'podcast-producer',
    currentPhase: '02. Plan',
    updatedAt: 'Yesterday',
    summary: '10-episode bilingual founder interview podcast with YouTube video clips, Shorts cutdowns, and automated guest intake.',
    tasks: [
      {
        id: 't-201',
        title: 'Finalize Episode 1 guest interview questions & intro script',
        phase: '02. Plan',
        studio: 'podcast-producer',
        status: 'In Progress',
        dueDate: 'Nov 22',
      },
      {
        id: 't-202',
        title: 'Configure n8n webhook connecting guest form to Notion & Gmail',
        phase: '04. Execute',
        studio: 'automation-lab',
        status: 'Pending',
        dueDate: 'Nov 24',
      },
    ],
  },
];

export const QUICK_STARTER_PROMPTS: Array<{
  title: string;
  studioTag: string;
  prompt: string;
}> = [
  {
    title: 'Launch a Business Website',
    studioTag: 'Web + Deployment',
    prompt: 'Plan and structure a modern, mobile-friendly website for a local boutique digital agency, including pages, tech stack recommendation, and a Cloudflare Pages launch checklist.',
  },
  {
    title: 'Cinematic Veo / Runway Reel',
    studioTag: 'AI Video Prompts',
    prompt: 'Create a 4-scene cinematic promotional video prompt sequence for Google Veo and Runway Gen-4 (9:16 vertical) for a handmade craft coffee brand, complete with camera movement, lighting, and CapCut editing notes.',
  },
  {
    title: 'Podcast Episode Blueprint',
    studioTag: 'Podcast Production',
    prompt: 'Create a 30-minute podcast episode outline, intro script, and 8 thoughtful interview questions on building sustainable creator businesses.',
  },
  {
    title: 'WhatsApp Support & FAQ Flow',
    studioTag: 'WhatsApp Business',
    prompt: 'Draft polite, consent-respecting WhatsApp Business welcome messages, 5 FAQ auto-replies, and a follow-up workflow in both English and Bengali (বাংলা).',
  },
];

export function getUiText(lang: WorkspaceLanguage) {
  const isBn = lang === 'bn';
  return {
    newProject: isBn ? 'নতুন প্রজেক্ট' : 'New Project',
    coreGroup: isBn ? 'এআই ও প্রজেক্ট' : 'Agent & Workspace',
    studiosGroup: isBn ? 'প্রোডাকশন স্টুডিও' : 'Production Studios',
    languageLabel: isBn ? 'ভাষা' : 'Language',
    themeLabel: isBn ? 'থিম' : 'Theme',
    activeProjectLabel: isBn ? 'সক্রিয় প্রজেক্ট' : 'Active Project',
    send: isBn ? 'পাঠান' : 'Send',
    generate: isBn ? 'তৈরি করুন' : 'Generate Blueprint',
    generating: isBn ? 'তৈরি হচ্ছে...' : 'Generating...',
    copy: isBn ? 'কপি' : 'Copy',
    copied: isBn ? 'কপি হয়েছে' : 'Copied',
    saveToProject: isBn ? 'প্রজেক্টে যোগ করুন' : 'Add to Project Hub',
  };
}
