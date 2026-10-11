/** Tabla de resultados de URLs (código final, cadena, destino y avisos), compartida por el comprobador y el auditor */
import { traceIssues, traceTone, type Trace, type TraceIssue } from './url-status-client';

export interface TraceTableLabels {
  url: string;
  status: string;
  chain: string;
  issues: string;
  noIssues: string;
  issueText: Record<TraceIssue, string>;
  errorText: Record<string, string>;
}

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') =>
  Object.assign(document.createElement(tag), { className, textContent: text });

export const renderTraceTable = (table: HTMLTableElement, traces: Trace[], labels: TraceTableLabels) => {
  const headRow = element('tr');
  headRow.append(...[labels.url, labels.status, labels.chain, labels.issues].map((label) => element('th', 'py-2 pr-4 font-semibold', label)));
  const head = element('thead');
  head.append(headRow);
  const body = element('tbody');
  for (const trace of traces) {
    const tone = traceTone(trace);
    const row = element('tr', 'border-t border-line align-top');
    const urlCell = element('td', 'py-3 pr-4 font-mono text-[0.8rem] break-all', trace.url);
    if (trace.finalUrl !== trace.url && trace.hops.length > 1) urlCell.append(element('span', 'mt-1 block text-muted', `→ ${trace.finalUrl}`));
    const statusLabel = trace.status ?? labels.errorText[trace.error ?? ''] ?? trace.error ?? '—';
    const statusCell = element('td', 'py-3 pr-4');
    statusCell.append(element('span', `bot-badge bot-badge-${tone}`, String(statusLabel)));
    const chainCell = element('td', 'py-3 pr-4 font-mono text-[0.8rem] whitespace-nowrap', trace.hops.map((hop) => hop.status).join(' → ') || '—');
    const issues = traceIssues(trace).filter((issue) => issue !== 'error');
    const issuesCell = element('td', `py-3 text-[0.85rem] ${issues.length ? `bot-tone-${tone}` : 'text-muted'}`, issues.length ? issues.map((issue) => labels.issueText[issue]).join(' ') : labels.noIssues);
    row.append(urlCell, statusCell, chainCell, issuesCell);
    body.append(row);
  }
  table.replaceChildren(head, body);
};
