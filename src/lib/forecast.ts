/**
 * Forecast SEO a partir de los exports de Search Console, todo en el navegador:
 *  - Escenarios: curva de CTR por posición de la propia web y clics extra si las consultas suben.
 *  - Serie temporal: con más de un año, crecimiento interanual y forma del último año; si no, tendencia log-lineal. Banda del 80 %.
 */

// ---------- Lectura de exports ----------

/** CSV con comillas; detecta coma, punto y coma o tabulador */
export const parseCsv = (text: string): string[][] => {
  const clean = text.replace(/^﻿/, '');
  const firstLine = clean.slice(0, clean.indexOf('\n') >>> 0);
  const delimiter = [',', ';', '\t'].reduce((best, candidate) =>
    firstLine.split(candidate).length > firstLine.split(best).length ? candidate : best
  );
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < clean.length; index++) {
    const char = clean[index];
    if (quoted) {
      if (char === '"' && clean[index + 1] === '"') {
        field += '"';
        index++;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && clean[index + 1] === '\n') index++;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
};

/** Enteros con o sin separador de miles ("1.234", "1,234", "1 234") */
const parseInteger = (value: string) => Number(value.replace(/[^\d-]/g, '')) || 0;

/** Decimales en formato español o inglés ("3,2", "3.2", "12,5 %") */
const parseDecimal = (value: string) => {
  const cleaned = value.replace(/[%\s]/g, '');
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  const normalized =
    lastComma > lastDot ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned.replace(/,/g, '');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : NaN;
};

const HEADER_PATTERNS = {
  query: /consulta|query|queries|search term/i,
  page: /p[aá]gina|page|url/i,
  date: /fecha|date|d[ií]a|day/i,
  clicks: /clic|click/i,
  impressions: /impres/i,
  position: /posici|position/i,
};

const findColumn = (header: string[], pattern: RegExp) => header.findIndex((cell) => pattern.test(cell.trim()));

export interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface DateRow {
  date: string;
  clicks: number;
  impressions: number;
}

export type ExportKind = 'queries' | 'dates' | 'unknown';

export const detectExport = (rows: string[][]): ExportKind => {
  const header = rows[0] ?? [];
  if (findColumn(header, HEADER_PATTERNS.clicks) === -1) return 'unknown';
  if (findColumn(header, HEADER_PATTERNS.query) !== -1 && findColumn(header, HEADER_PATTERNS.position) !== -1) return 'queries';
  if (findColumn(header, HEADER_PATTERNS.date) !== -1) return 'dates';
  return 'unknown';
};

export const readQueries = (rows: string[][]): QueryRow[] => {
  const [header, ...body] = rows;
  const columns = {
    query: findColumn(header, HEADER_PATTERNS.query),
    clicks: findColumn(header, HEADER_PATTERNS.clicks),
    impressions: findColumn(header, HEADER_PATTERNS.impressions),
    position: findColumn(header, HEADER_PATTERNS.position),
  };
  return body
    .map((cells) => ({
      query: (cells[columns.query] ?? '').trim(),
      clicks: parseInteger(cells[columns.clicks] ?? ''),
      impressions: parseInteger(cells[columns.impressions] ?? ''),
      position: parseDecimal(cells[columns.position] ?? ''),
    }))
    .filter((row) => row.query && row.impressions > 0 && row.position >= 1);
};

export const readDates = (rows: string[][]): DateRow[] => {
  const [header, ...body] = rows;
  const columns = {
    date: findColumn(header, HEADER_PATTERNS.date),
    clicks: findColumn(header, HEADER_PATTERNS.clicks),
    impressions: findColumn(header, HEADER_PATTERNS.impressions),
  };
  return body
    .map((cells) => ({
      date: (cells[columns.date] ?? '').trim(),
      clicks: parseInteger(cells[columns.clicks] ?? ''),
      impressions: columns.impressions === -1 ? 0 : parseInteger(cells[columns.impressions] ?? ''),
    }))
    .filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/** Ficheros de un ZIP (el export de Search Console), descomprimidos con DecompressionStream */
export const readZip = async (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  let end = buffer.byteLength - 22;
  while (end >= 0 && view.getUint32(end, true) !== 0x06054b50) end--;
  if (end < 0) throw new Error('not-zip');
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  const decoder = new TextDecoder();
  const files: { name: string; text: string }[] = [];
  for (let index = 0; index < count; index++) {
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(new Uint8Array(buffer, offset + 46, nameLength));
    offset += 46 + nameLength + extraLength + commentLength;
    if (!/\.csv$/i.test(name)) continue;
    const dataStart = localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
    const data = new Uint8Array(buffer, dataStart, compressedSize);
    if (method === 0) files.push({ name, text: decoder.decode(data) });
    else if (method === 8) {
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      files.push({ name, text: await new Response(stream).text() });
    }
  }
  return files;
};

// ---------- Escenarios por posición ----------

export const CURVE_POSITIONS = 20;
/** Por debajo de estas impresiones, el CTR de una posición es ruido */
const MIN_BUCKET_IMPRESSIONS = 100;

export interface CtrCurve {
  /** CTR (0-1) de la posición 1 a la 20 */
  ctr: number[];
  /** Si el valor sale de datos de esa posición o está interpolado */
  observed: boolean[];
}

/**
 * Curva de CTR de la propia web: clics / impresiones por posición redondeada, forzada a no crecer
 * al bajar de posición (pool adjacent violators) e interpolada donde no hay datos suficientes
 */
export const buildCtrCurve = (rows: QueryRow[]): CtrCurve => {
  const buckets = Array.from({ length: CURVE_POSITIONS }, () => ({ clicks: 0, impressions: 0 }));
  for (const row of rows) {
    const bucket = Math.min(CURVE_POSITIONS, Math.max(1, Math.round(row.position))) - 1;
    buckets[bucket].clicks += row.clicks;
    buckets[bucket].impressions += row.impressions;
  }
  const points = buckets
    .map((bucket, index) => ({ index, weight: bucket.impressions, value: bucket.impressions ? bucket.clicks / bucket.impressions : 0 }))
    .filter((point) => point.weight >= MIN_BUCKET_IMPRESSIONS);
  if (points.length === 0) return { ctr: Array(CURVE_POSITIONS).fill(0), observed: Array(CURVE_POSITIONS).fill(false) };

  // PAV para una serie no creciente
  const blocks: { start: number; end: number; weight: number; value: number }[] = [];
  points.forEach((point, order) => {
    blocks.push({ start: order, end: order, weight: point.weight, value: point.value });
    while (blocks.length > 1 && blocks[blocks.length - 2].value < blocks[blocks.length - 1].value) {
      const last = blocks.pop()!;
      const previous = blocks.pop()!;
      const weight = previous.weight + last.weight;
      blocks.push({ start: previous.start, end: last.end, weight, value: (previous.value * previous.weight + last.value * last.weight) / weight });
    }
  });
  const fitted = new Map<number, number>();
  for (const block of blocks) for (let order = block.start; order <= block.end; order++) fitted.set(points[order].index, block.value);

  const known = [...fitted.keys()].sort((a, b) => a - b);
  const ctr = Array.from({ length: CURVE_POSITIONS }, (_, index) => {
    if (fitted.has(index)) return fitted.get(index)!;
    const before = known.filter((position) => position < index).at(-1);
    const after = known.find((position) => position > index);
    if (before === undefined) return fitted.get(after!)!;
    if (after === undefined) return fitted.get(before)!;
    const ratio = (index - before) / (after - before);
    return fitted.get(before)! + (fitted.get(after)! - fitted.get(before)!) * ratio;
  });
  return { ctr, observed: ctr.map((_, index) => fitted.has(index)) };
};

/** CTR de la curva para una posición con decimales (interpolación lineal; más allá de la 20, la 20) */
export const ctrAt = (curve: number[], position: number) => {
  const clamped = Math.min(CURVE_POSITIONS, Math.max(1, position));
  const lower = Math.floor(clamped);
  const upper = Math.min(CURVE_POSITIONS, lower + 1);
  return curve[lower - 1] + (curve[upper - 1] - curve[lower - 1]) * (clamped - lower);
};

const MIN_RELATIVE_CTR = 0.5;
const MAX_RELATIVE_CTR = 1.5;

export interface ScenarioOptions {
  minPosition: number;
  maxPosition: number;
  mode: 'target' | 'climb';
  /** Posición objetivo (target) o puestos que sube (climb) */
  value: number;
  brandPattern: RegExp | null;
}

export interface ScenarioRow extends QueryRow {
  newPosition: number;
  projectedClicks: number;
  extraClicks: number;
}

export const runScenario = (rows: QueryRow[], curve: number[], options: ScenarioOptions): ScenarioRow[] =>
  rows
    .filter((row) => !options.brandPattern?.test(row.query))
    .filter((row) => row.position >= options.minPosition && row.position <= options.maxPosition)
    .map((row) => {
      const newPosition =
        options.mode === 'target' ? Math.min(row.position, options.value) : Math.max(1, row.position - options.value);
      const currentCtr = ctrAt(curve, row.position);
      // Cuánto rinde la consulta frente a la curva (anuncios, AI Overviews, intención…), acotado para que
      // un puñado de clics en posiciones bajas no se multiplique por 50 al subir
      const relative = currentCtr > 0 ? Math.min(MAX_RELATIVE_CTR, Math.max(MIN_RELATIVE_CTR, row.clicks / row.impressions / currentCtr)) : 1;
      const projectedClicks = Math.max(row.clicks, row.impressions * ctrAt(curve, newPosition) * relative);
      return { ...row, newPosition, projectedClicks, extraClicks: Math.max(0, projectedClicks - row.clicks) };
    })
    .sort((a, b) => b.extraClicks - a.extraClicks);

// ---------- Serie temporal ----------

const DAY_MS = 86_400_000;
const toDay = (date: string) => Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10)) / DAY_MS;
const fromDay = (day: number) => new Date(day * DAY_MS).toISOString().slice(0, 10);

export interface WeekPoint {
  /** Lunes de la semana (YYYY-MM-DD) */
  week: string;
  clicks: number;
}

/** Semanas completas de lunes a domingo; los días sin fila cuentan como 0 clics */
export const toWeeks = (rows: DateRow[]): WeekPoint[] => {
  if (rows.length === 0) return [];
  const byDay = new Map(rows.map((row) => [toDay(row.date), row.clicks]));
  const first = toDay(rows[0].date);
  const last = toDay(rows.at(-1)!.date);
  // 1970-01-01 fue jueves: (día + 3) % 7 da 0 para los lunes
  const firstMonday = first + ((7 - ((first + 3) % 7)) % 7);
  const weeks: WeekPoint[] = [];
  for (let monday = firstMonday; monday + 6 <= last; monday += 7) {
    let clicks = 0;
    for (let day = monday; day < monday + 7; day++) clicks += byDay.get(day) ?? 0;
    weeks.push({ week: fromDay(monday), clicks });
  }
  return weeks;
};

export interface ForecastOptions {
  /** Semanas que se usan para la tendencia (las últimas) */
  trendWeeks: number;
  horizonWeeks: number;
  seasonality: boolean;
}

export interface ForecastPoint {
  week: string;
  value: number;
  low: number;
  high: number;
}

export interface ForecastResult {
  points: ForecastPoint[];
  /** Crecimiento mensual de la tendencia (0.05 = +5 % al mes) */
  monthlyGrowth: number;
  seasonalityApplied: boolean;
}

const Z_80 = 1.2816;
export const MIN_WEEKS = 8;
/** Para la estacionalidad hacen falta un año entero más unas semanas que comparar con el anterior */
export const SEASONALITY_MIN_WEEKS = 60;

const fitLine = (xs: number[], ys: number[]) => {
  const n = xs.length;
  const meanX = xs.reduce((sum, x) => sum + x, 0) / n;
  const meanY = ys.reduce((sum, y) => sum + y, 0) / n;
  const sxx = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
  const slope = sxx ? xs.reduce((sum, x, index) => sum + (x - meanX) * (ys[index] - meanY), 0) / sxx : 0;
  const intercept = meanY - slope * meanX;
  const squaredErrors = ys.reduce((sum, y, index) => sum + (y - (intercept + slope * xs[index])) ** 2, 0);
  const sigma = n > 2 ? Math.sqrt(squaredErrors / (n - 2)) : 0;
  return { slope, intercept, sigma, meanX, sxx, n };
};

const back = (value: number) => Math.max(0, Math.exp(value) - 1);

export const forecastWeeks = (weeks: WeekPoint[], options: ForecastOptions): ForecastResult => {
  const logs = weeks.map((point) => Math.log(point.clicks + 1));
  const lastWeek = toDay(weeks.at(-1)!.week);
  const weekAfter = (step: number) => fromDay(lastWeek + 7 * (step + 1));

  if (options.seasonality && weeks.length >= SEASONALITY_MIN_WEEKS) {
    // Tendencia = crecimiento interanual medio (cada semana contra la misma del año anterior): la estacionalidad se anula sola
    const diffs = logs.slice(52).map((value, index) => value - logs[index]);
    const growth = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length / 52;
    // Último año sin tendencia: su forma es la estacionalidad (suavizada a 3 semanas) más el nivel
    const lastYear = logs.slice(-52).map((value, index) => value - growth * (weeks.length - 52 + index));
    const level = lastYear.reduce((sum, value) => sum + value, 0) / lastYear.length;
    const shape = lastYear.map((_, index) => {
      const window = lastYear.slice(Math.max(0, index - 1), index + 2);
      return window.reduce((sum, value) => sum + value, 0) / window.length - level;
    });
    const diffSigma = Math.sqrt(diffs.reduce((sum, diff) => sum + (diff - growth * 52) ** 2, 0) / Math.max(1, diffs.length - 1));
    const noise = diffSigma / Math.SQRT2;
    const growthError = diffSigma / 52 / Math.sqrt(diffs.length);
    const points = Array.from({ length: options.horizonWeeks }, (_, step) => {
      const index = weeks.length + step;
      const center = level + growth * index + shape[(step % 52 + 52) % 52];
      const spread = Z_80 * Math.sqrt(noise ** 2 + ((step + 1) * growthError) ** 2);
      return { week: weekAfter(step), value: back(center), low: back(center - spread), high: back(center + spread) };
    });
    return { points, monthlyGrowth: Math.exp((growth * 52) / 12) - 1, seasonalityApplied: true };
  }

  // Sin un año de histórico: recta sobre el logaritmo de las últimas semanas
  const xs = weeks.map((_, index) => index).slice(Math.max(0, weeks.length - options.trendWeeks));
  const fit = fitLine(xs, xs.map((index) => logs[index]));
  const points = Array.from({ length: options.horizonWeeks }, (_, step) => {
    const index = weeks.length + step;
    const center = fit.intercept + fit.slope * index;
    const spread = Z_80 * fit.sigma * Math.sqrt(1 + 1 / fit.n + (fit.sxx ? (index - fit.meanX) ** 2 / fit.sxx : 0));
    return { week: weekAfter(step), value: back(center), low: back(center - spread), high: back(center + spread) };
  });
  return { points, monthlyGrowth: Math.exp((fit.slope * 52) / 12) - 1, seasonalityApplied: false };
};

/** Reparte cada semana entre los meses de sus 7 días; `days` dice cuántos días de cada mes quedan cubiertos */
export const weeksToMonths = <T extends { week: string }>(points: T[], keys: (keyof T & string)[]) => {
  const months = new Map<string, Record<string, number>>();
  for (const point of points) {
    const monday = toDay(point.week);
    for (let day = monday; day < monday + 7; day++) {
      const month = fromDay(day).slice(0, 7);
      const totals = months.get(month) ?? Object.fromEntries([['days', 0], ...keys.map((key) => [key, 0])]);
      totals.days += 1;
      for (const key of keys) totals[key] += (point[key] as number) / 7;
      months.set(month, totals);
    }
  }
  return [...months.entries()].map(([month, totals]) => ({ month, ...totals }) as { month: string; days: number } & Record<string, number>);
};
