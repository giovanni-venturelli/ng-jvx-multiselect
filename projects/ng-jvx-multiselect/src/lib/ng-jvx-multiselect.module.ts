import {NgModule} from '@angular/core';
import {NgJvxMultiselectComponent} from './ng-jvx-multiselect.component';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {NgJvxDisabledOptionDirective} from './directives/ng-jvx-disabled-option.directive';
import {NgJvxGroupHeaderDirective} from './directives/ng-jvx-group-header.directive';
import {NgJvxMultisectChipComponent} from './chiplist/chip/chip.component';

@NgModule({
  imports: [
    NgJvxMultiselectComponent,
    NgJvxOptionComponent,
    NgJvxOptionsTemplateDirective,
    NgJvxSelectionTemplateDirective,
    NgJvxDisabledOptionDirective,
    NgJvxMultisectChipComponent,
    NgJvxGroupHeaderDirective
  ],
  exports: [NgJvxMultiselectComponent,
    NgJvxOptionComponent,
    NgJvxOptionsTemplateDirective,
    NgJvxSelectionTemplateDirective,
    NgJvxDisabledOptionDirective,
    NgJvxMultisectChipComponent,
    NgJvxGroupHeaderDirective]
})
export class NgJvxMultiselectModule {
}
