import {Observable, Subject} from 'rxjs';

export interface NgJvxOptionMapper {
  mapOption(source: any): Observable<any>;
}
