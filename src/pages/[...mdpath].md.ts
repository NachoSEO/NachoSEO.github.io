import type { APIRoute, GetStaticPaths } from 'astro';
import { getAgentDocs, type AgentDoc } from '../lib/agent-content';

/** Versión Markdown de cada página: /sobre-mi/ → /sobre-mi.md, / → /index.md */
export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getAgentDocs();
  return docs.map((doc) => ({ params: { mdpath: doc.mdPath.slice(1, -'.md'.length) }, props: { doc } }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(`${(props.doc as AgentDoc).markdown}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
