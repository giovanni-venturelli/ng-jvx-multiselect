export interface NavLink {
  anchor: string;
  label: string;
  /** Termini aggiuntivi per cui il link deve comparire nella ricerca (per esempio i nomi degli input). */
  keywords?: string[];
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Divide il testo cercato in parole minuscole, ignorando spazi multipli. */
export function searchTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
}

/**
 * Filtra l'indice degli esempi: un link resta se ogni parola cercata compare nella sua etichetta,
 * nelle sue parole chiave o nel titolo del suo gruppo. I gruppi senza link rimasti vengono eliminati.
 */
export function filterNav(nav: NavGroup[], query: string): NavGroup[] {
  const terms = searchTerms(query);
  if (terms.length === 0) {
    return nav;
  }
  return nav
    .map(group => ({
      title: group.title,
      links: group.links.filter(link => {
        const text = [group.title, link.label, ...(link.keywords ?? [])].join(' ').toLowerCase();
        return terms.every(term => text.includes(term));
      })
    }))
    .filter(group => group.links.length > 0);
}
