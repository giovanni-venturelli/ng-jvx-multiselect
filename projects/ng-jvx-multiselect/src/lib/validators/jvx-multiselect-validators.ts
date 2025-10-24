import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const required = (control: AbstractControl): ValidationErrors | null => {
  const value: any[] = control.value;
  if (!!value && value.length > 0) {
    return null;
  }

  return {required: true};
};

export const minLength = (min: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: any[] = control.value;
    if (!!value && value.length >= min) {
      return null;
    }

    return {minSelectionLength: true};
  };
};

export const maxLength = (max: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: any[] = control.value;
    if (!!value && value.length <= max) {
      return null;
    }

    return {maxSelectionLength: true};
  };
};

