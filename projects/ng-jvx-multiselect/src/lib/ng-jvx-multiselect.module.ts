import {NgModule} from '@angular/core';
import {NgJvxMultiselectComponent} from './ng-jvx-multiselect.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyOptionModule as MatOptionModule} from '@angular/material/legacy-core';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {CommonModule} from '@angular/common';
import {NgJvxOptionComponent} from './ng-jvx-option/ng-jvx-option.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {NgJvxOptionsTemplateDirective} from './directives/ng-jvx-options-template.directive';
import {MatIconModule} from '@angular/material/icon';
import {NgJvxPanelComponent} from './ng-jvx-panel/ng-jvx-panel.component';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {SmoothScrollModule} from 'ngx-scrollbar/smooth-scroll';
import {NgJvxSelectionTemplateDirective} from './directives/ng-jvx-selection-template.directive';
import {NgJvxDisabledOptionDirective} from './directives/ng-jvx-disabled-option.directive';
import {NgJvxGroupHeaderDirective} from './directives/ng-jvx-group-header.directive';
import {NgJvxFocusDirective} from './directives/ng-jvx-focus.directive';


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
    NgScrollbarModule,
    SmoothScrollModule,
    FormsModule
  ],
  exports: [NgJvxMultiselectComponent,
    NgJvxOptionComponent,
    NgJvxOptionsTemplateDirective,
    NgJvxSelectionTemplateDirective,
    NgJvxDisabledOptionDirective,
    NgJvxGroupHeaderDirective]
})
export class NgJvxMultiselectModule {
}
