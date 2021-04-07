import {Observable, Subject} from 'rxjs';

export interface NgJvxOptionMapper<T> {
  mapOption(source: any): Observable<T>;
}
