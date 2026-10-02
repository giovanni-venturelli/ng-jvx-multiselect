import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  ViewEncapsulation
} from '@angular/core';

/**
 * A selectable option of the panel. Used internally to render the options and usable in the default slot of
 * `<ng-jvx-multiselect>` to declare static options in the template.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-option',
  templateUrl: './ng-jvx-option.component.html',
  styleUrl: './ng-jvx-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'option',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[class.ng-jvx-option-disabled]': 'disabled()'
  }
})
export class NgJvxOptionComponent {
  /** Emitted when the option is clicked (not emitted while disabled). */
  @Output() clickOnOption = new EventEmitter<any>();

  readonly value = input<any>();
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly isSelected = input(false, {transform: booleanAttribute});

  /** Selection state set by the parent multiselect for options declared in its default slot. */
  readonly selectedByParent = signal(false);
  protected readonly selected = computed(() => this.isSelected() || this.selectedByParent());

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Text content of the option, used as label for options declared in the template. */
  get label(): string {
    return this.host.nativeElement.textContent?.trim() ?? '';
  }

  protected onClick(): void {
    if (!this.disabled()) {
      this.clickOnOption.emit(this.value());
    }
  }
}
