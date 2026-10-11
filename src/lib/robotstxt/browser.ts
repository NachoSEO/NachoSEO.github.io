/** Carga el parser de robots.txt en el navegador una sola vez por página */
import wasmUrl from './robotstxt.wasm?url';
import { loadRobotsEngine, type RobotsEngine } from './index';

let engine: Promise<RobotsEngine> | undefined;

export const getBrowserRobotsEngine = () =>
  (engine ??= WebAssembly.compileStreaming(fetch(wasmUrl))
    .catch(() => fetch(wasmUrl).then((response) => response.arrayBuffer()).then((bytes) => WebAssembly.compile(bytes)))
    .then(loadRobotsEngine)
    .catch((error) => {
      engine = undefined;
      throw error;
    }));
