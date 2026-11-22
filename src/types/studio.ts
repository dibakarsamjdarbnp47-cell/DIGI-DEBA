export type StudioId =
  | 'command'
  | 'projects'
  | 'web-architect'
  | 'video-prompt'
  | 'podcast-producer'
  | 'whatsapp-comms'
  | 'brand-marketing'
  | 'automation-lab';

export type WorkspaceLanguage = 'en' | 'bn' | 'bilingual';

export type WorkflowPhase =
  | '01. Understand'
  | '02. Plan'
  | '03. Create'
  | '04. Execute'
  | '05. Test'
  | '06. Improve'
  | '07. Deliver';

export type TaskStatus = 'Completed' | 'In Progress' | 'Pending' | 'Needs Approval';

export interface ProjectTask {
  id: string;
  title: string;
  phase: WorkflowPhase;
  studio: StudioId;
  status: TaskStatus;
  dueDate: string;
}

export interface DigitalProject {
  id: string;
  title: string;
  clientOrBrand: string;
  primaryStudio: StudioId;
  currentPhase: WorkflowPhase;
  updatedAt: string;
  summary: string;
  tasks: ProjectTask[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface WebArchitectOutput {
  summary: string;
  recommendedStack: string;
  htmlPreviewCode: string;
  pagesAndRoutes: Array<{
    route: string;
    purpose: string;
    keyComponents: string;
  }>;
  launchChecklist: Array<{
    step: string;
    category: string;
    details: string;
  }>;
}

export interface VideoPromptOutput {
  conceptTitle: string;
  logline: string;
  visualStyleGuide: string;
  scenes: Array<{
    sceneNumber: number;
    durationSeconds: number;
    shotType: string;
    aiVideoPrompt: string;
    voiceOver: string;
    subtitleText: string;
    transitionToNext: string;
  }>;
  editingTimeline: {
    musicAndSfx: string;
    colorAndEffects: string;
    exportSettings: string;
  };
}

export interface PodcastProducerOutput {
  episodeTitles: string[];
  episodeDescription: string;
  introScript: string;
  segments: Array<{
    timestamp: string;
    title: string;
    talkingPoints: string;
  }>;
  interviewQuestions: string[];
  outroScript: string;
  promoPosts: Array<{
    platform: string;
    copy: string;
  }>;
  recordingAndPublishingChecklist: string[];
}

export interface WhatsAppCommsOutput {
  workflowSummary: string;
  complianceNote: string;
  templates: Array<{
    name: string;
    trigger: string;
    messageText: string;
  }>;
  faqPairs: Array<{
    question: string;
    automatedReply: string;
  }>;
  chatbotFlowSteps: string[];
  integrationNotes: string;
}

export interface BrandMarketingOutput {
  brandDirection: string;
  logoConcept: string;
  colorPalette: Array<{
    role: string;
    hex: string;
    usage: string;
  }>;
  typographyPair: string;
  thumbnailOrPosterPrompt: string;
  contentCalendar: Array<{
    day: string;
    platform: string;
    format: string;
    hookAndTopic: string;
    cta: string;
  }>;
  seoKeywords: string[];
  hashtags: string[];
}

export interface AutomationLabOutput {
  workflowName: string;
  architectureSummary: string;
  nodes: Array<{
    stepNumber: number;
    nodeName: string;
    service: string;
    action: string;
    dataPassed: string;
  }>;
  sampleWebhookPayloadJson: string;
  errorHandlingAndSecurity: string[];
}
