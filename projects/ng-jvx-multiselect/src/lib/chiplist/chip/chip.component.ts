import {Component, forwardRef, inject, input, output, ViewEncapsulation} from '@angular/core';
import {NgJvxMultiselectComponent} from '../../ng-jvx-multiselect.component';

@Component({
    selector: 'ng-jvx-multiselect-chip',
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class NgJvxMultisectChipComponent {
  removed = output<any>();
  value = input<any>();
  disabled = input<boolean>(false);
  container = inject(NgJvxMultiselectComponent, {optional: true});

  clickOnRemove(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    if (this.container && !this.container.disabled){
      this.container.deselect(this.value());
    }
  }
}
