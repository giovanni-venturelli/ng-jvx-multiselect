import {forkJoin, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {NgJvxGroup, NgJvxGroupMapper} from '../interfaces/ng-jvx-group-mapper';
import {NgJvxOptionGroup} from './models';

/** Orders two option keys: numerically when both are numbers, as (natural) strings otherwise. */
export function compareKeys(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, {numeric: true});
}

/** Returns a copy of `options` sorted by their `key` property. */
export function sortByKey<T>(options: readonly T[], key: string): T[] {
  return [...options].sort((a, b) => compareKeys(keyOf(a, key), keyOf(b, key)));
}

/** Reads the key of an option; primitives are their own key. */
export function keyOf(option: unknown, key: string): unknown {
  return option !== null && typeof option === 'object' ? (option as Record<string, unknown>)[key] : option;
}

/** True when both selections contain the same keys, regardless of order. */
export function sameSelection(a: readonly unknown[] | null | undefined, b: readonly unknown[] | null | undefined,
                              key: string): boolean {
  if (!a?.length && !b?.length) {
    return true;
  }
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  const keys = new Set(a.map(o => keyOf(o, key)));
  return b.every(o => keys.has(keyOf(o, key)));
}

/**
 * Reads a property from an object. `path` is first looked up as a plain key, then as a dot-separated path
 * (e.g. `'data.items'`), so nested response shapes are supported too.
 */
export function readPath(source: unknown, path: string): any {
  if (source === null || typeof source !== 'object' || !path) {
    return undefined;
  }
  const record = source as Record<string, any>;
  if (path in record) {
    return record[path];
  }
  return path.split('.').reduce((acc, part) => (acc !== null && typeof acc === 'object' ? acc[part] : undefined), record);
}

export type GroupBy<T = any> = NgJvxGroupMapper<T> | string | null | undefined;

/** True when `groupBy` actually enables grouping. */
export function isGroupingEnabled(groupBy: GroupBy): boolean {
  return typeof groupBy === 'string' ? groupBy.length > 0 : !!groupBy;
}

/** Splits `options` into groups, preserving the order in which groups and options first appear. */
export function groupOptions<T>(options: readonly T[], groupBy: GroupBy<T>): Observable<NgJvxOptionGroup<T>[]> {
  if (!isGroupingEnabled(groupBy) || options.length === 0) {
    return of([]);
  }
  const entries$: Observable<NgJvxGroup<T>[]> = typeof groupBy === 'string'
    ? of(options.map(option => ({group: readPath(option, groupBy), option})))
    : forkJoin(options.map(option => (groupBy as NgJvxGroupMapper<T>).mapGroup(option)));

  return entries$.pipe(map(entries => {
    const groups = new Map<unknown, T[]>();
    for (const {group, option} of entries) {
      const bucket = groups.get(group);
      bucket ? bucket.push(option) : groups.set(group, [option]);
    }
    return Array.from(groups, ([group, grouped]) => ({group, options: grouped}));
  }));
}
