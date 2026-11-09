import {searchTerms} from './nav-filter';

export const SEARCH_HIGHLIGHT_NAME = 'demo-search';

/** Parole più corte di così non vengono evidenziate: troppo rumore nel testo. */
const MIN_HIGHLIGHT_LENGTH = 2;

/**
 * Evidenzia nel contenuto di `root` le parole cercate, senza modificare il DOM, con la CSS Custom Highlight API.
 * Lo stile è `::highlight(demo-search)` in styles.scss. Con testo vuoto toglie l'evidenziazione.
 */
export function highlightMatches(root: HTMLElement, query: string): void {
  if (typeof CSS === 'undefined' || !CSS.highlights) {
    return;
  }
  const terms = searchTerms(query).filter(term => term.length >= MIN_HIGHLIGHT_LENGTH);
  if (terms.length === 0) {
    CSS.highlights.delete(SEARCH_HIGHLIGHT_NAME);
    return;
  }

  const ranges: Range[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.toLowerCase() ?? '';
    for (const term of terms) {
      for (let start = text.indexOf(term); start !== -1; start = text.indexOf(term, start + term.length)) {
        const range = new Range();
        range.setStart(node, start);
        range.setEnd(node, start + term.length);
        ranges.push(range);
      }
    }
  }

  if (ranges.length === 0) {
    CSS.highlights.delete(SEARCH_HIGHLIGHT_NAME);
  } else {
    CSS.highlights.set(SEARCH_HIGHLIGHT_NAME, new Highlight(...ranges));
  }
}
