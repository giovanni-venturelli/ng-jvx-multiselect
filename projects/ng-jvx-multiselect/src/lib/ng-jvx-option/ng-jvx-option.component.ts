import {Component, DoCheck, EventEmitter, input, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ng-jvx-option',
    templateUrl: './ng-jvx-option.component.html',
    styleUrls: ['./ng-jvx-option.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class NgJvxOptionComponent {
  @Output() clickOnOption = new EventEmitter<any>();
  value = input<any>();
  disabled = input<boolean>(false);
  isSelected = input<boolean>(false);

  constructor() {
  }

}
