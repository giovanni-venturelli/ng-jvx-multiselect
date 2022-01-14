import {NgModule} from '@angular/core';
import {NgJvxMultiselectComponent} from './ng-jvx-multiselect.component';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {MatMenuModule} from '@angular/material/menu';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {MatIconModule} from '@angular/material/icon';
import {NgJvxPanelComponent} from './ng-jvx-panel/ng-jvx-panel.component';
import {MatListModule} from '@angular/material/list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {HttpClientModule} from '@angular/common/http';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {SmoothScrollModule} from 'ngx-scrollbar/smooth-scroll';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {NgJvxDisabledOptionDirective} from './directives/ng-jvx-disabled-option.directive';
import { NgJvxGroupHeaderDirective } from './directives/ng-jvx-group-header.directive';
import { NgJvxFocusDirective } from './directives/ng-jvx-focus.directive';


@NgModule({
  declarations: [
    NgJvxMultiselectComponent,
    NgJvxOptionComponent,
    NgJvxOptionsTemplateDirective,
    NgJvxPanelComponent,
    NgJvxSelectionTemplateDirective,
    NgJvxDisabledOptionDirective,
    NgJvxGroupHeaderDirective,
    NgJvxFocusDirective],
  imports: [
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    CommonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgScrollbarModule,
    SmoothScrollModule,
    FormsModule
  ],
  exports: [NgJvxMultiselectComponent, NgJvxOptionComponent, NgJvxOptionsTemplateDirective, NgJvxSelectionTemplateDirective, NgJvxDisabledOptionDirective, NgJvxGroupHeaderDirective]
})
export class NgJvxMultiselectModule {
}
