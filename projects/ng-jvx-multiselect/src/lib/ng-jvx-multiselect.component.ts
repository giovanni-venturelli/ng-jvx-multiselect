import {AfterViewChecked, Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-jvx-multiselect',
  templateUrl: './ng-jvx-multiselect.component.html',
  styleUrls: ['./ng-jvx-multiselect.component.scss'],
})
export class NgJvxMultiselectComponent implements OnInit, AfterViewChecked {
  @ContentChild(NgJvxOptionsTemplateDirective) optionsTemplate: NgJvxOptionsTemplateDirective | null = null;
  // @ContentChild(TemplateRef) optionsTemplate: TemplateRef<any> | null = null;
  @Input() options: any[] = [];
  @Input() multi = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    console.log(this.optionsTemplate);
  }
}
