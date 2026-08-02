import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0E1015"/>
  <path d="M 80 520 C 400 520, 560 500, 720 430 C 880 360, 1010 250, 1120 150"
        stroke="#7C96FF" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="1120" cy="150" r="14" fill="#7C96FF"/>
  <text x="80" y="200" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="700" fill="#E8EAF0">Nacho Mascort</text>
  <text x="80" y="280" font-family="Menlo, monospace" font-size="34" fill="#9AA1B2">growth · ai · seo</text>
  <text x="80" y="580" font-family="Menlo, monospace" font-size="26" fill="#9AA1B2">nachomascort.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(process.argv[2]);
console.log('OG image written');
