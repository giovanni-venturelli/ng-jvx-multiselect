import {Component, DoCheck, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatListOption} from '@angular/material/list';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-option',
  templateUrl: './ng-jvx-option.component.html',
  styleUrls: ['./ng-jvx-option.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgJvxOptionComponent implements OnInit, DoCheck {
  @ViewChild('listOption', {static: true}) listOption: MatListOption;
  @Input() value: any;
  @Input() isSelected = false;
  // public isSelected = false;

  constructor() {
  }

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    // if (this.isSelected !== this.listOption.selected) {
    //   this.isSelected = this.listOption.selected;
    // }
  }

  deselect(): void{
    this.listOption.selected = false;
  }
}
