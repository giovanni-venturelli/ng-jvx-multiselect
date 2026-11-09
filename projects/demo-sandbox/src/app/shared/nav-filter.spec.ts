import {filterNav, NavGroup, searchTerms} from './nav-filter';

describe('nav-filter', () => {
  const nav: NavGroup[] = [
    {
      title: 'Static options',
      links: [
        {anchor: 'single', label: 'Single selection'},
        {anchor: 'multi', label: 'Multiple selection'}
      ]
    },
    {
      title: 'Options from a backend',
      links: [
        {anchor: 'remote-get', label: 'GET, pagination, search'},
        {anchor: 'remote-list', label: 'Non-paginated list'}
      ]
    }
  ];

  describe('searchTerms', () => {
    it('should split the text in lowercase words ignoring extra spaces', () => {
      expect(searchTerms('  Single   SELECTION ')).toEqual(['single', 'selection']);
    });

    it('should return no terms for an empty text', () => {
      expect(searchTerms('   ')).toEqual([]);
    });
  });

  describe('filterNav', () => {
    it('should return the whole index when the query is empty', () => {
      expect(filterNav(nav, '')).toBe(nav);
      expect(filterNav(nav, '  ')).toBe(nav);
    });

    it('should keep only the links whose label contains the query, ignoring case', () => {
      const result = filterNav(nav, 'PAGINAT');

      expect(result.map(g => g.title)).toEqual(['Options from a backend']);
      expect(result[0].links.map(l => l.anchor)).toEqual(['remote-get', 'remote-list']);
    });

    it('should hide the groups left without links', () => {
      const result = filterNav(nav, 'multiple');

      expect(result.length).toBe(1);
      expect(result[0].links.map(l => l.anchor)).toEqual(['multi']);
    });

    it('should match the title of the group and keep all its links', () => {
      const result = filterNav(nav, 'backend');

      expect(result.length).toBe(1);
      expect(result[0].links.length).toBe(2);
    });

    it('should require every word to match, in the label or in the group title', () => {
      expect(filterNav(nav, 'static single').map(g => g.links.map(l => l.anchor))).toEqual([['single']]);
      expect(filterNav(nav, 'single backend')).toEqual([]);
    });

    it('should match the keywords of a link even if they are not in its label', () => {
      const withKeywords: NavGroup[] = [
        {
          title: 'Static options',
          links: [
            {anchor: 'templates', label: 'Custom templates', keywords: ['chip', 'footer']},
            {anchor: 'groups', label: 'Groups', keywords: ['groupBy']}
          ]
        }
      ];

      expect(filterNav(withKeywords, 'CHIP')[0].links.map(l => l.anchor)).toEqual(['templates']);
      expect(filterNav(withKeywords, 'groupby')[0].links.map(l => l.anchor)).toEqual(['groups']);
    });

    it('should return an empty index when nothing matches', () => {
      expect(filterNav(nav, 'xyz')).toEqual([]);
    });
  });
});
