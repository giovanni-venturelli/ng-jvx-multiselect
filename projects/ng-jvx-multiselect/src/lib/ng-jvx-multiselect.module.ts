import {NgModule} from '@angular/core';
import {NgJvxMultiselectComponent} from './multiselect/ng-jvx-multiselect.component';
import {NgJvxOptionComponent} from './option/ng-jvx-option.component';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {NgJvxDisabledOptionDirective} from './directives/ng-jvx-disabled-option.directive';
import {NgJvxGroupHeaderDirective} from './directives/ng-jvx-group-header.directive';
import {NgJvxMultisectChipComponent} from './chip/ng-jvx-multiselect-chip.component';

const NG_JVX_MULTISELECT = [
  NgJvxMultiselectComponent,
  NgJvxOptionComponent,
  NgJvxOptionsTemplateDirective,
  NgJvxSelectionTemplateDirective,
  NgJvxDisabledOptionDirective,
  NgJvxMultisectChipComponent,
  NgJvxGroupHeaderDirective
];

/**
 * Convenience NgModule exporting all the standalone building blocks of the library.
 * Standalone applications can import the single components/directives instead.
 */
@NgModule({
  imports: NG_JVX_MULTISELECT,
  exports: NG_JVX_MULTISELECT
})
export class NgJvxMultiselectModule {
}
