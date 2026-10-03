import type { APIRoute } from 'astro';
import { getAgentDocs } from '../lib/agent-content';

/** Todo el contenido del sitio en Markdown, en un solo archivo para LLMs */
export const GET: APIRoute = async () => {
  const docs = await getAgentDocs();
  const body = docs.map((doc) => doc.markdown).join('\n\n---\n\n');
  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
