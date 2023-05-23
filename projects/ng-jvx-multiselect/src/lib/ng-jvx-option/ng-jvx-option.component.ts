import {AfterViewChecked, Component, ContentChild, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatLegacyListOption as MatListOption} from '@angular/material/legacy-list';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-option',
  templateUrl: './ng-jvx-option.component.html',
  styleUrls: ['./ng-jvx-option.component.scss']
})
export class NgJvxOptionComponent implements OnInit, DoCheck {
  @ViewChild('listOption', {static: true}) listOption: MatListOption;
  @Input() value: any;
  public isSelected = false;

  constructor() {
  }

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    if (this.isSelected !== this.listOption.selected) {
      this.isSelected = this.listOption.selected;
    }
  }

  deselect(): void{
    this.listOption.selected = false;
  }
}
