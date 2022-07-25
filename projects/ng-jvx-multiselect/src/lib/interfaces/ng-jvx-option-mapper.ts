import {Observable, Subject} from 'rxjs';

/**
 * Maps the option returned by the async call in an object of type T. When object is mapped the resulting object is returned in an observable
 */
export interface NgJvxOptionMapper<T> {
  mapOption(source: any): Observable<T>;
}

/**
 * Maps the options returned by the async call in an object of type T. When object is mapped the resulting object is returned in an observable
 */
export interface NgJvxMultiOptionMapper<T> {
  mapOptions(source: any): Observable<T[]>;
}
