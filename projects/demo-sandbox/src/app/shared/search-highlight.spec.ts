import {highlightMatches, SEARCH_HIGHLIGHT_NAME} from './search-highlight';

describe('highlightMatches', () => {
  let root: HTMLElement;

  const highlightedTexts = (): string[] =>
    Array.from(CSS.highlights.get(SEARCH_HIGHLIGHT_NAME) ?? []).map(range => range.toString());

  beforeEach(() => {
    root = document.createElement('div');
    root.innerHTML = '<h2>Client-side search</h2><p>The <code>search</code> mode: Search is case insensitive.</p>';
    document.body.appendChild(root);
  });

  afterEach(() => {
    CSS.highlights.delete(SEARCH_HIGHLIGHT_NAME);
    root.remove();
  });

  it('should highlight every occurrence of the words, ignoring case', () => {
    highlightMatches(root, 'search');

    expect(highlightedTexts()).toEqual(['search', 'search', 'Search']);
  });

  it('should highlight each word of the query', () => {
    highlightMatches(root, 'client insensitive');

    expect(highlightedTexts().sort()).toEqual(['Client', 'insensitive']);
  });

  it('should not highlight words shorter than two characters', () => {
    highlightMatches(root, 's');

    expect(CSS.highlights.has(SEARCH_HIGHLIGHT_NAME)).toBeFalse();
  });

  it('should remove the highlight when the query is cleared', () => {
    highlightMatches(root, 'search');
    highlightMatches(root, '');

    expect(CSS.highlights.has(SEARCH_HIGHLIGHT_NAME)).toBeFalse();
  });

  it('should remove the highlight when nothing is found', () => {
    highlightMatches(root, 'search');
    highlightMatches(root, 'zzz');

    expect(CSS.highlights.has(SEARCH_HIGHLIGHT_NAME)).toBeFalse();
  });
});
