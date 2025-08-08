import {NgModule} from '@angular/core';
import {NgJvxMultiselectComponent} from './ng-jvx-multiselect.component';
import {CommonModule} from '@angular/common';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {SmoothScroll} from 'ngx-scrollbar/smooth-scroll';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {NgJvxDisabledOptionDirective} from './directives/ng-jvx-disabled-option.directive';
import {NgJvxGroupHeaderDirective} from './directives/ng-jvx-group-header.directive';
import {NgJvxFocusDirective} from './directives/ng-jvx-focus.directive';
import {MenuTriggerDirective} from './panel/menu-trigger/menu-trigger.directive';
import {PanelComponent} from './panel/panel.component';
import {NgJvxMultisectChipComponent} from './chiplist/chip/chip.component';

@NgModule({
  declarations: [
    MenuTriggerDirective,
    NgJvxMultiselectComponent,
    NgJvxOptionComponent,
    NgJvxOptionsTemplateDirective,
    NgJvxSelectionTemplateDirective,
    NgJvxDisabledOptionDirective,
    NgJvxGroupHeaderDirective,
    NgJvxFocusDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    SmoothScroll,
    FormsModule,
    PanelComponent,
    NgJvxMultisectChipComponent
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
