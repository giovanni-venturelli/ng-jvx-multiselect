import {InjectionToken, Signal} from '@angular/core';

/**
 * What the chips need from the multiselect that contains them. Provided by `NgJvxMultiselectComponent`;
 * the token avoids a circular import between the two components.
 */
export interface NgJvxMultiselectContainer {
  readonly disabledState: Signal<boolean>;

  deselect(option: any): void;
}

export const NG_JVX_MULTISELECT_CONTAINER = new InjectionToken<NgJvxMultiselectContainer>('NG_JVX_MULTISELECT_CONTAINER');
