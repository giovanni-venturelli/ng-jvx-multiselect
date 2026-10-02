import {Observable} from 'rxjs';

/**
 * Maps each option returned by the remote call to an object of type T.
 */
export interface NgJvxOptionMapper<T> {
  mapOption(source: any): Observable<T>;
}

/**
 * Maps the whole response of the remote call, before the single options are mapped.
 * Receives the raw response: the array itself, or the response object when `listProp` is set.
 */
export interface NgJvxMultiOptionMapper<T> {
  mapOptions(source: any): Observable<T[]>;
}
