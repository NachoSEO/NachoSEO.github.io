/**
 * Parser oficial de robots.txt de Google (github.com/google/robotstxt) compilado a WebAssembly.
 * Se regenera con scripts/robotstxt-wasm/build.sh. Recibe el módulo ya compilado para que sirva igual
 * en el navegador (compileStreaming) y en una Pages Function (import del .wasm).
 */
import createRobotsModule from './robotstxt.mjs';

export interface RobotsVerdict {
  allowed: boolean;
  /** Línea del robots.txt que decide; 0 si ninguna regla coincide */
  line: number;
  /** Si hay un grupo específico para ese user-agent (si no, aplica el de *) */
  specificAgent: boolean;
}

export const RobotsTag = { Unknown: 0, UserAgent: 1, Allow: 2, Disallow: 3, Sitemap: 4, Unused: 5 } as const;
export type RobotsTag = (typeof RobotsTag)[keyof typeof RobotsTag];

export interface RobotsLine {
  line: number;
  tag: RobotsTag;
  typo: boolean;
  missingColon: boolean;
  tooLong: boolean;
  comment: boolean;
  empty: boolean;
}

export interface RobotsReport {
  lines: RobotsLine[];
  validDirectives: number;
  unusedDirectives: number;
}

export interface RobotsEngine {
  /** `url` tiene que ir con %-encoding (RFC 3986): new URL(...).href ya lo hace */
  check(robots: string, userAgent: string, url: string): RobotsVerdict;
  isValidUserAgent(userAgent: string): boolean;
  report(robots: string): RobotsReport;
}

export const loadRobotsEngine = (wasm: WebAssembly.Module): Promise<RobotsEngine> =>
  createRobotsModule({
    instantiateWasm: (imports: WebAssembly.Imports, done: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void) => {
      WebAssembly.instantiate(wasm, imports).then((instance) => done(instance, wasm));
      return {};
    },
  });

/** Líneas como las cuenta Google: \n, \r y \r\n terminan línea */
export const robotsLines = (robots: string) => robots.split(/\r\n|\r|\n/);

/** Texto de la regla que decide, sin el comentario (null si no decide ninguna) */
export const ruleText = (robots: string, line: number) =>
  line > 0 ? (robotsLines(robots)[line - 1] ?? '').replace(/#.*$/, '').trim() || null : null;

/** URLs de las líneas Sitemap que reconoce Google, también con las erratas que acepta */
export const sitemapsFrom = (engine: RobotsEngine, robots: string) => {
  const lines = robotsLines(robots);
  return engine
    .report(robots)
    .lines.filter((parsed) => parsed.tag === RobotsTag.Sitemap)
    .map((parsed) => (lines[parsed.line - 1] ?? '').replace(/#.*$/, '').replace(/^\s*[^:\s]+\s*:?\s*/, '').trim())
    .filter(Boolean);
};
