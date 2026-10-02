import {Observable} from 'rxjs';

/** Assigns each option to a group. Useful for nested properties or computed grouping rules. */
export interface NgJvxGroupMapper<T> {
  mapGroup(option: T): Observable<NgJvxGroup<T>>;
}

/** An option wrapped together with the name of the group it belongs to. */
export interface NgJvxGroup<T> {
  group: string;
  option: T;
}
