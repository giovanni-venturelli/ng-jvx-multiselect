import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation
} from '@angular/core';
import {NG_JVX_MULTISELECT_CONTAINER} from '../core/container';

/**
 * A removable chip representing a selected option. Rendered by the multiselect in multiple selection and
 * reusable inside `*ngJvxSelectionTemplate`: when placed inside a multiselect, removing the chip deselects the option.
 */
@Component({
  selector: 'ng-jvx-multiselect-chip',
  templateUrl: './ng-jvx-multiselect-chip.component.html',
  styleUrl: './ng-jvx-multiselect-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NgJvxMultisectChipComponent {
  /** Emitted with the chip value when the remove button is clicked. */
  readonly removed = output<any>();
  readonly value = input<any>();
  readonly disabled = input(false, {transform: booleanAttribute});

  /** The multiselect containing the chip, if any. */
  readonly container = inject(NG_JVX_MULTISELECT_CONTAINER, {optional: true});

  protected readonly isDisabled = computed(() => this.disabled() || !!this.container?.disabledState());

  clickOnRemove(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    if (this.isDisabled()) {
      return;
    }
    this.removed.emit(this.value());
    this.container?.deselect(this.value());
  }
}
