import type { ImageMetadata } from 'astro';
import softonicMono from '../assets/logos/mono/softonic.png';
import softonicColor from '../assets/logos/color/softonic.png';
import wordTipsMono from '../assets/logos/mono/word-tips.png';
import wordTipsColor from '../assets/logos/color/word-tips.png';

export type CaseBrand =
  | { kind: 'image'; mono: ImageMetadata; color: ImageMetadata; alt: string; height: number }
  | { kind: 'text'; text: string };

/** Marca y resumen corto de cada caso, por translationKey */
export const caseBrands: Record<string, { brand: CaseBrand; summary: { es: string; en: string } }> = {
  'organic-growth': {
    brand: { kind: 'text', text: 'Reverse Tech' },
    summary: { es: 'El área orgánica, montada desde cero', en: 'Organic area built from scratch' },
  },
  'ad-factory': {
    brand: { kind: 'text', text: 'Reverse Tech' },
    summary: { es: 'Fábrica de anuncios con IA', en: 'AI ad factory' },
  },
  softonic: {
    brand: { kind: 'image', mono: softonicMono, color: softonicColor, alt: 'Softonic', height: 30 },
    summary: { es: 'Un programa de contenido a gran escala', en: 'Content program in two years' },
  },
  'word-tips': {
    brand: { kind: 'image', mono: wordTipsMono, color: wordTipsColor, alt: 'word.tips', height: 30 },
    summary: { es: 'Tráfico duplicado, con picos de 2M de visitas al día', en: 'Traffic doubled, up to 2M visits a day' },
  },
};
