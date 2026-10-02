import {Observable} from 'rxjs';

/**
 * Filters the available options for a client-side search.
 * Receives the search text and the options, returns the options to show.
 */
export interface NgJvxSearchMapper<T> {
  mapSearch(source: any, options: T[]): Observable<T[]>;
}
