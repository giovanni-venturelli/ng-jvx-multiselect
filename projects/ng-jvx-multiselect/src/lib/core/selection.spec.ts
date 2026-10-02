import {of} from 'rxjs';
import {compareKeys, groupOptions, readPath, sameSelection, sortByKey} from './selection';

describe('selection helpers', () => {
  it('compares numbers numerically and strings naturally', () => {
    expect(compareKeys(2, 10)).toBeLessThan(0);
    expect(compareKeys('item 2', 'item 10')).toBeLessThan(0);
  });

  it('sorts options by key without mutating the input', () => {
    const input = [{value: 3}, {value: 1}, {value: 2}];
    expect(sortByKey(input, 'value').map(o => o.value)).toEqual([1, 2, 3]);
    expect(input[0].value).toBe(3);
  });

  it('compares selections by key regardless of order', () => {
    expect(sameSelection([{value: 1}, {value: 2}], [{value: 2}, {value: 1}], 'value')).toBeTrue();
    expect(sameSelection([{value: 1}], [{value: 2}], 'value')).toBeFalse();
    expect(sameSelection(null, [], 'value')).toBeTrue();
  });

  it('reads plain keys and dot-separated paths', () => {
    expect(readPath({'a.b': 1}, 'a.b')).toBe(1);
    expect(readPath({a: {b: 2}}, 'a.b')).toBe(2);
    expect(readPath({a: 1}, 'missing.path')).toBeUndefined();
  });

  it('groups by property name preserving the order of appearance', done => {
    groupOptions([{g: 'b', v: 1}, {g: 'a', v: 2}, {g: 'b', v: 3}], 'g').subscribe(groups => {
      expect(groups.map(g => g.group)).toEqual(['b', 'a']);
      expect(groups[0].options.map(o => o.v)).toEqual([1, 3]);
      done();
    });
  });

  it('groups through a mapper', done => {
    const mapper = {mapGroup: (option: { n: { g: string } }) => of({group: option.n.g, option})};
    groupOptions([{n: {g: 'x'}}, {n: {g: 'y'}}], mapper).subscribe(groups => {
      expect(groups.map(g => g.group)).toEqual(['x', 'y']);
      done();
    });
  });
});
