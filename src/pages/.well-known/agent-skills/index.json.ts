/**
 * Índice de skills para agentes (Agent Skills Discovery RFC v0.2.0 de Cloudflare):
 * /.well-known/agent-skills/index.json. La huella SHA-256 se calcula del zip publicado en cada build.
 */
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const GET: APIRoute = async () => {
  const archive = await readFile(new URL('../../../../public/descargas/google-quality-audit.zip', import.meta.url));
  const index = {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [
      {
        name: 'google-quality-audit',
        type: 'archive',
        description:
          "Audit a page, template or section against Google's quality criteria: the four rater-guideline pillars (effort, originality, skill, accuracy), commodity content, site focus and the related Content Warehouse leak signals, labelling what is documented and what is inference.",
        url: '/descargas/google-quality-audit.zip',
        digest: `sha256:${createHash('sha256').update(archive).digest('hex')}`,
      },
    ],
  };
  return new Response(`${JSON.stringify(index, null, 2)}\n`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
