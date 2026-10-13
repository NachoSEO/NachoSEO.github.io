/**
 * Catálogo de recursos para agentes (Agentic Resource Discovery, ai-catalog.json). La especificación aún es un
 * borrador: solo se listan recursos que existen (llms.txt, versión Markdown, índice de skills y la skill).
 */
import type { APIRoute } from 'astro';

const site = 'https://nachomascort.com';

export const GET: APIRoute = () => {
  const catalog = {
    specVersion: '1.0',
    host: {
      displayName: 'Nacho Mascort',
      identifier: 'nachomascort.com',
      documentationUrl: `${site}/llms.txt`,
    },
    entries: [
      {
        identifier: 'urn:ai:nachomascort.com:doc:llms-txt',
        displayName: 'llms.txt',
        type: 'text/markdown',
        url: `${site}/llms.txt`,
        description: 'Index of the site for language models: services, case studies, studies, tools and posts, with links to their Markdown versions.',
      },
      {
        identifier: 'urn:ai:nachomascort.com:doc:llms-full-txt',
        displayName: 'llms-full.txt',
        type: 'text/markdown',
        url: `${site}/llms-full.txt`,
        description: 'Full text of the site in Markdown, in one file.',
      },
      {
        identifier: 'urn:ai:nachomascort.com:catalog:agent-skills',
        displayName: 'Agent skills index',
        type: 'application/json',
        url: `${site}/.well-known/agent-skills/index.json`,
        description: 'Agent skills published by Nacho Mascort.',
      },
      {
        identifier: 'urn:ai:nachomascort.com:skill:google-quality-audit',
        displayName: 'Google Quality Audit skill',
        type: 'application/zip',
        url: `${site}/descargas/google-quality-audit.zip`,
        description: "Agent skill that audits pages against Google's quality criteria.",
      },
    ],
  };
  return new Response(`${JSON.stringify(catalog, null, 2)}\n`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
