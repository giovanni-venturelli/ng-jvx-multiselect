import {Observable, Subject} from 'rxjs';

export interface NgJvxGroupMapper<T> {
  mapGroup(option: T): Observable<NgJvxGroup<T>>;
}

export interface NgJvxGroup<T> {
  group: string;
  option: T;
}
