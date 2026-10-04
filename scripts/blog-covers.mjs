// Portadas de posts al estilo de las de seohacks.es: ilustración plana y título grande.
// Uso: node scripts/blog-covers.mjs  (escribe un cover.png de 1200x630 en la carpeta de cada post)
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const textLines = (lines, { x, y, size, lineHeight, ...attrs }) => {
  const attributes = Object.entries(attrs)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}="${value}"`)
    .join(' ');
  return lines
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" font-size="${size}" ${attributes}>${escapeXml(line)}</text>`)
    .join('');
};

const tree = (x, baseY, scale, crown) => `
  <rect x="${x - 5 * scale}" y="${baseY - 70 * scale}" width="${10 * scale}" height="${70 * scale}" fill="#7a5230"/>
  <ellipse cx="${x}" cy="${baseY - 95 * scale}" rx="${38 * scale}" ry="${55 * scale}" fill="${crown}"/>
  <path d="M${x} ${baseY - 140 * scale} V${baseY - 40 * scale}" stroke="#ffffff" stroke-opacity="0.25" stroke-width="${4 * scale}"/>`;

const cloud = (x, y, scale) => `
  <g fill="#ffffff" transform="translate(${x} ${y}) scale(${scale})">
    <rect x="0" y="20" width="150" height="34" rx="17"/>
    <circle cx="55" cy="22" r="26"/><circle cx="92" cy="16" r="30"/>
  </g>`;

/** Quality: paisaje plano como la portada de "HTTPS gratis", con la línea de visibilidad subiendo y cayendo */
const qualityCover = ({ title, subtitle }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#2ec4e6"/>
  <circle cx="1010" cy="120" r="88" fill="#fbe9a0"/>
  ${cloud(70, 70, 0.8)}${cloud(860, 230, 0.6)}${cloud(380, 40, 0.5)}
  <polyline points="20,250 90,200 160,230 230,330 300,290 420,280 520,190 690,300 790,215 930,300 1000,200 1080,240 1160,130"
    fill="none" stroke="#ffffff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" stroke-opacity="0.9"/>
  <circle cx="230" cy="330" r="11" fill="#c8073f" stroke="#ffffff" stroke-width="4"/>
  <circle cx="1160" cy="130" r="11" fill="#ffffff"/>
  <path d="M-20 520 L170 300 L360 520 Z" fill="#1f8a5b"/>
  <path d="M170 300 L215 352 L190 345 L170 370 L150 345 L125 352 Z" fill="#c8f0d8"/>
  <path d="M880 520 L1060 330 L1240 520 Z" fill="#2b9e6a"/>
  <path d="M0 500 C200 430 380 470 600 450 C820 430 1000 470 1200 440 V630 H0 Z" fill="#8fd16a"/>
  ${tree(90, 500, 1.1, '#3fae49')}${tree(160, 515, 0.8, '#5cc24f')}${tree(1060, 490, 1.2, '#3fae49')}${tree(1135, 505, 0.85, '#5cc24f')}
  <path d="M0 560 C300 530 600 575 1200 545 V630 H0 Z" fill="#1aa59a"/>
  <rect x="290" y="150" width="620" height="290" rx="6" fill="#2f3e4e"/>
  ${textLines([title], { x: 600, y: 268, size: 104, lineHeight: 0, textAnchor: 'middle', fill: '#ffffff', fontFamily: 'Rockwell', fontWeight: 700, letterSpacing: 4 })}
  ${textLines(subtitle, { x: 600, y: 336, size: 34, lineHeight: 44, textAnchor: 'middle', fill: '#e8eef2', fontFamily: 'Avenir Next', fontWeight: 500 })}
</svg>`;

const gear = (x, y, radius, teeth, rotation) => {
  const toothPaths = Array.from({ length: teeth }, (_, index) => {
    const angle = (360 / teeth) * index + rotation;
    return `<rect x="${-radius * 0.16}" y="${-radius * 1.28}" width="${radius * 0.32}" height="${radius * 0.4}" rx="4" transform="rotate(${angle})"/>`;
  }).join('');
  return `<g transform="translate(${x} ${y})" fill="#f6c9a0" fill-opacity="0.55">
    ${toothPaths}<circle r="${radius}"/><circle r="${radius * 0.38}" fill="#fbf1e1"/>
  </g>`;
};

/** Scraping: fondo crema con engranajes como "imágenes originales" y un navegador con las llamadas XHR */
const scrapingCover = ({ title, subtitle }) => {
  const rows = [
    ['complete/search?q=scraping', 'xhr', '200'],
    ['complete/search?q=scraping+n', 'xhr', '200'],
    ['complete/search?q=scraping+no', 'xhr', '200'],
    ['logo.svg', 'img', '200'],
  ];
  const networkRows = rows
    .map(
      ([name, type, status], index) => `
      <rect x="0" y="${index * 40}" width="440" height="40" fill="${index < 3 ? '#fff4d6' : '#ffffff'}"/>
      <text x="14" y="${index * 40 + 26}" font-family="Menlo" font-size="15" fill="#2f3e4e">${escapeXml(name)}</text>
      <text x="330" y="${index * 40 + 26}" font-family="Menlo" font-size="15" fill="#c8073f">${type}</text>
      <text x="392" y="${index * 40 + 26}" font-family="Menlo" font-size="15" fill="#1f8a5b">${status}</text>`,
    )
    .join('');
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fbf1e1"/>
  ${gear(110, 520, 120, 10, 8)}${gear(1120, 90, 90, 9, 0)}${gear(560, 70, 46, 8, 12)}
  ${textLines([title], { x: 70, y: 225, size: 84, lineHeight: 0, fill: '#23272e', fontFamily: 'Arial Black', fontWeight: 900, letterSpacing: 2 })}
  ${textLines(subtitle, { x: 74, y: 300, size: 40, lineHeight: 52, fill: '#c8073f', fontFamily: 'Georgia', fontStyle: 'italic', fontWeight: 700 })}
  <g transform="translate(660 140)">
    <rect x="8" y="12" width="480" height="380" rx="14" fill="#23272e" fill-opacity="0.18"/>
    <rect width="480" height="380" rx="14" fill="#ffffff" stroke="#23272e" stroke-width="4"/>
    <path d="M0 14 A14 14 0 0 1 14 0 H466 A14 14 0 0 1 480 14 V44 H0 Z" fill="#2f3e4e"/>
    <circle cx="26" cy="22" r="7" fill="#ff6159"/><circle cx="50" cy="22" r="7" fill="#ffbd2e"/><circle cx="74" cy="22" r="7" fill="#28c941"/>
    <text x="20" y="80" font-family="Menlo" font-size="16" font-weight="700" fill="#2f3e4e">Network · Fetch/XHR</text>
    <g transform="translate(20 100)">${networkRows}</g>
    <rect x="20" y="276" width="440" height="84" rx="8" fill="#23272e"/>
    <text x="36" y="310" font-family="Menlo" font-size="16" fill="#8fd16a">$ curl 'https://…/complete/search?q=…'</text>
    <text x="36" y="340" font-family="Menlo" font-size="16" fill="#fbe9a0">["scraping", ["scraping python", …]]</text>
  </g>
</svg>`;
};

const covers = [
  {
    file: 'src/content/blog/es/quality-google-core-updates/cover.png',
    svg: qualityCover({ title: 'QUALITY', subtitle: ['Qué es, cómo la mide Google', 'y cuánto tarda en recuperarse'] }),
  },
  {
    file: 'src/content/blog/en/google-quality-core-updates/cover.png',
    svg: qualityCover({ title: 'QUALITY', subtitle: ['What it is, how Google measures it', 'and how long recovery takes'] }),
  },
  {
    file: 'src/content/blog/es/scraping-endpoints-google-autocomplete/cover.png',
    svg: scrapingCover({ title: 'SCRAPING', subtitle: ['secuestrando las llamadas', 'del front-end a sus', 'endpoints'] }),
  },
  {
    file: 'src/content/blog/en/scraping-google-autocomplete-endpoints/cover.png',
    svg: scrapingCover({ title: 'SCRAPING', subtitle: ['by hijacking the', "front-end's calls to", 'its endpoints'] }),
  },
];

await Promise.all(covers.map(({ file, svg }) => sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(file)));
console.log(`${covers.length} covers written`);
