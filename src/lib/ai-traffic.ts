/** Generadores del constructor de canal de tráfico IA: regex, Looker Studio y BigQuery */

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Hostname limpio a partir de lo que pegue el usuario ("https://www.chatgpt.com/x" -> "chatgpt.com") */
export const normalizeHost = (input: string) => {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  try {
    const host = new URL(/^[a-z]+:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`).hostname.replace(/^www\./, '');
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : null;
  } catch {
    return null;
  }
};

/**
 * Anclada y con subdominio opcional: funciona igual si la herramienta hace coincidencia completa
 * (Looker Studio, channel groups) o parcial (BigQuery REGEXP_CONTAINS, filtros de informes)
 */
export const buildSourceRegex = (hosts: string[]) => {
  const unique = [...new Set(hosts)].sort();
  return unique.length ? `^(.*\\.)?(${unique.map(escapeRegex).join('|')})$` : '';
};

/** Algunas pantallas de GA4 rechazan regex de más de 256 caracteres: la misma lista en trozos para unir con OR */
export const splitSourceRegex = (hosts: string[], maxLength = 256) =>
  [...new Set(hosts)].sort().reduce<string[][]>((chunks, host) => {
    const last = chunks.at(-1);
    if (last && buildSourceRegex([...last, host]).length <= maxLength) last.push(host);
    else chunks.push([host]);
    return chunks;
  }, []).map(buildSourceRegex);

export const buildLookerField = (regex: string, channelName: string, sourceField: string, channelField: string) =>
  [
    'CASE',
    `  WHEN REGEXP_MATCH(${sourceField}, "${regex.replace(/\\/g, '\\\\')}") THEN "${channelName.replace(/"/g, '')}"`,
    `  ELSE ${channelField}`,
    'END',
  ].join('\n');

export const buildBigQuery = (regex: string, comments: { title: string; dataset: string; window: string }) =>
  `-- ${comments.title}
-- ${comments.dataset}
WITH session_starts AS (
  SELECT
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    LOWER(COALESCE(
      collected_traffic_source.manual_source,
      NET.HOST((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer'))
    )) AS source
  FROM \`your-project.analytics_123456789.events_*\`
  -- ${comments.window}
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
    AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
    AND event_name = 'session_start'
)
SELECT
  source,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '-', CAST(session_id AS STRING))) AS sessions
FROM session_starts
WHERE REGEXP_CONTAINS(source, r'${regex}')
GROUP BY source
ORDER BY sessions DESC;`;
