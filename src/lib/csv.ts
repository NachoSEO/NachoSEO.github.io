/** CSV seguro para Excel y Sheets: una celda que empieza por = + - @ se abriría como fórmula */
export const csvCell = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return String(Math.round(value * 100) / 100);
  const text = String(value ?? '');
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const toCsv = (header: string[], rows: (string | number | null | undefined)[][]) =>
  [header.join(','), ...rows.map((row) => row.map(csvCell).join(','))].join('\n');
