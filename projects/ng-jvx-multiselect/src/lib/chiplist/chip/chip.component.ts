import {Component, EventEmitter, input, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
    selector: 'lib-chip',
    imports: [
        NgClass
    ],
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ChipComponent {
  @Output() removed = new EventEmitter();

  disabled = input<boolean>(false);

  clickOnRemove(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    if (!this.disabled()) {
      this.removed.emit();
    }
  }
}
