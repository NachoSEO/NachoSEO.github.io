/** Bots de buscadores e IA que comprueban las herramientas (comprobador de bots y tester de robots.txt) */

export type BotKind = 'search' | 'ai-search' | 'ai-assistant' | 'ai-training';

export interface Bot {
  name: string;
  company: string;
  kind: BotKind;
  /** Token que se busca en el robots.txt */
  token: string;
  /** Sin user-agent: es solo un token de robots.txt (Google-Extended, Applebot-Extended) */
  userAgent?: string;
}

export const BOTS: Bot[] = [
  {
    name: 'Googlebot',
    company: 'Google',
    kind: 'search',
    token: 'googlebot',
    userAgent:
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
  {
    name: 'Bingbot',
    company: 'Microsoft',
    kind: 'search',
    token: 'bingbot',
    userAgent:
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36',
  },
  {
    name: 'Applebot',
    company: 'Apple',
    kind: 'search',
    token: 'applebot',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)',
  },
  {
    name: 'OAI-SearchBot',
    company: 'OpenAI',
    kind: 'ai-search',
    token: 'oai-searchbot',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot',
  },
  {
    name: 'ChatGPT-User',
    company: 'OpenAI',
    kind: 'ai-assistant',
    token: 'chatgpt-user',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  },
  {
    name: 'GPTBot',
    company: 'OpenAI',
    kind: 'ai-training',
    token: 'gptbot',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.3; +https://openai.com/gptbot',
  },
  {
    name: 'Claude-SearchBot',
    company: 'Anthropic',
    kind: 'ai-search',
    token: 'claude-searchbot',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +Claude-SearchBot@anthropic.com)',
  },
  {
    name: 'Claude-User',
    company: 'Anthropic',
    kind: 'ai-assistant',
    token: 'claude-user',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)',
  },
  {
    name: 'ClaudeBot',
    company: 'Anthropic',
    kind: 'ai-training',
    token: 'claudebot',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  },
  {
    name: 'PerplexityBot',
    company: 'Perplexity',
    kind: 'ai-search',
    token: 'perplexitybot',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  },
  {
    name: 'Perplexity-User',
    company: 'Perplexity',
    kind: 'ai-assistant',
    token: 'perplexity-user',
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
  },
  {
    name: 'DuckAssistBot',
    company: 'DuckDuckGo',
    kind: 'ai-assistant',
    token: 'duckassistbot',
    userAgent: 'DuckAssistBot/1.2; (+http://duckduckgo.com/duckassistbot.html)',
  },
  {
    name: 'Meta-ExternalAgent',
    company: 'Meta',
    kind: 'ai-training',
    token: 'meta-externalagent',
    userAgent: 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
  },
  {
    name: 'Amazonbot',
    company: 'Amazon',
    kind: 'ai-training',
    token: 'amazonbot',
    userAgent:
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36',
  },
  { name: 'CCBot', company: 'Common Crawl', kind: 'ai-training', token: 'ccbot', userAgent: 'CCBot/2.0 (https://commoncrawl.org/faq/)' },
  { name: 'Google-Extended', company: 'Google', kind: 'ai-training', token: 'google-extended' },
  { name: 'Applebot-Extended', company: 'Apple', kind: 'ai-training', token: 'applebot-extended' },
];
