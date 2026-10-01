import { routes, ui, type Lang, type RouteKey, type UiKey } from './ui';

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key];
  };
}

export function localizedRoute(key: RouteKey, lang: Lang): string {
  return routes[key][lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

const dateLocales: Record<Lang, string> = { es: 'es-ES', en: 'en-US' };

export function formatDate(date: Date, lang: Lang, month: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(dateLocales[lang], { year: 'numeric', month, day: 'numeric' }).format(date);
}
