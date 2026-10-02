export type Lang = 'en' | 'it';

export const LANGS: { code: Lang, label: string }[] = [
  {code: 'en', label: 'English'},
  {code: 'it', label: 'Italiano'}
];

const STORAGE_KEY = 'ng-jvx-multiselect-demo-lang';
const DEFAULT_LANG: Lang = 'en';

function readLang(): Lang {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'it') {
    return fromUrl;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'it') {
      return stored;
    }
  } catch {
    // storage non disponibile: si usa la lingua predefinita
  }
  return DEFAULT_LANG;
}

/**
 * Lingua della demo, letta una sola volta all'avvio (?lang=, poi localStorage, poi inglese).
 * Cambiarla ricarica la pagina, così anche dati di esempio e selezioni ripartono nella nuova lingua.
 */
export const LANG: Lang = readLang();

/** Restituisce la variante della lingua corrente. */
export function t<T>(texts: Record<Lang, T>): T {
  return texts[LANG];
}

export function setLang(lang: Lang): void {
  if (lang === LANG) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignorato: senza storage la lingua vale solo per questo caricamento
  }
  const url = new URL(location.href);
  url.searchParams.delete('lang');
  location.assign(url.toString());
}
