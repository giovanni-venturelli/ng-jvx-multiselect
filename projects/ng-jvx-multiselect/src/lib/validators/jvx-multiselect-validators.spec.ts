import {FormControl} from '@angular/forms';
import {JvxMultiselectValidators} from './index';

describe('JvxMultiselectValidators', () => {
  const control = (value: unknown) => new FormControl(value);

  it('required fails on an empty or missing selection', () => {
    expect(JvxMultiselectValidators.required(control([]))).toEqual({required: true});
    expect(JvxMultiselectValidators.required(control(null))).toEqual({required: true});
    expect(JvxMultiselectValidators.required(control([{value: 1}]))).toBeNull();
  });

  it('minLength counts the selected items', () => {
    const min2 = JvxMultiselectValidators.minLength(2);
    expect(min2(control([1]))).toEqual({minSelectionLength: true});
    expect(min2(control([1, 2]))).toBeNull();
  });

  it('maxLength counts the selected items', () => {
    const max2 = JvxMultiselectValidators.maxLength(2);
    expect(max2(control([1, 2, 3]))).toEqual({maxSelectionLength: true});
    expect(max2(control([1, 2]))).toBeNull();
  });
});
