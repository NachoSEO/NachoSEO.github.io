/**
 * Hostnames desde los que llegan visitas de asistentes de IA (referrer o utm_source).
 * AI Overviews y AI Mode no aparecen: llegan como google / organic y no se pueden separar.
 */
export interface AiReferrer {
  id: string;
  name: string;
  hosts: string[];
}

export const AI_REFERRERS: AiReferrer[] = [
  { id: 'chatgpt', name: 'ChatGPT', hosts: ['chatgpt.com', 'chat.openai.com'] },
  { id: 'perplexity', name: 'Perplexity', hosts: ['perplexity.ai'] },
  { id: 'gemini', name: 'Gemini', hosts: ['gemini.google.com', 'bard.google.com'] },
  { id: 'copilot', name: 'Microsoft Copilot', hosts: ['copilot.microsoft.com', 'copilot.cloud.microsoft'] },
  { id: 'claude', name: 'Claude', hosts: ['claude.ai'] },
  { id: 'deepseek', name: 'DeepSeek', hosts: ['chat.deepseek.com'] },
  { id: 'grok', name: 'Grok', hosts: ['grok.com'] },
  { id: 'meta', name: 'Meta AI', hosts: ['meta.ai'] },
  { id: 'mistral', name: 'Le Chat (Mistral)', hosts: ['chat.mistral.ai'] },
  { id: 'notebooklm', name: 'NotebookLM', hosts: ['notebooklm.google.com'] },
  { id: 'qwen', name: 'Qwen', hosts: ['chat.qwen.ai'] },
  { id: 'poe', name: 'Poe', hosts: ['poe.com'] },
  { id: 'you', name: 'You.com', hosts: ['you.com'] },
];
