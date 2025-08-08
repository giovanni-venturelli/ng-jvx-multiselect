import {Component, EventEmitter, input, Input, output, Output, ViewEncapsulation} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
    selector: 'ng-jvx-multiselect-chip',
    imports: [
        NgClass
    ],
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class NgJvxMultisectChipComponent {
  removed = output<any>();

  value = input<any>();
  disabled = input<boolean>(false);

  clickOnRemove(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    if (!this.disabled()) {
      this.removed.emit(this.value);
    }
  }
}
