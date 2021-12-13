import {Observable, Subject} from 'rxjs';

/**
 * Maps the option returned by the async call in an object of type T. When object is mapped the resulting object is returned in an observable
 */
export interface NgJvxSearchMapper<T> {
  mapSearch(source: any, options: T): Observable<T>;
}
