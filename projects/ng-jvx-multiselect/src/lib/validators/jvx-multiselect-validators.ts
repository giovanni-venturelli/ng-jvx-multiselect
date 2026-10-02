import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/*
 * Validators for ng-jvx-multiselect controls. The value of the control is always an array of options,
 * in single selection too, so the validators count the selected items.
 */

const selectionLength = (control: AbstractControl): number => {
  const value = control.value;
  return Array.isArray(value) ? value.length : 0;
};

/** Fails with `{required: true}` when nothing is selected. */
export const required = (control: AbstractControl): ValidationErrors | null =>
  selectionLength(control) > 0 ? null : {required: true};

/** Fails with `{minSelectionLength: true}` when fewer than `min` items are selected. */
export const minLength = (min: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    selectionLength(control) >= min ? null : {minSelectionLength: true};

/** Fails with `{maxSelectionLength: true}` when more than `max` items are selected. */
export const maxLength = (max: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    Array.isArray(control.value) && control.value.length <= max ? null : {maxSelectionLength: true};
