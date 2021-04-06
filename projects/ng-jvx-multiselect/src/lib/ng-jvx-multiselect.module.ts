import { NgModule } from '@angular/core';
import { NgJvxMultiselectComponent } from './ng-jvx-multiselect.component';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import { NgJvxOptionComponent } from './ng-jvx-option/ng-jvx-option.component';
import {MatMenuModule} from '@angular/material/menu';
import { NgJvxOptionsTemplateDirective } from './directives/ng-jvx-options-template.directive';
import {MatIconModule} from '@angular/material/icon';
import { NgJvxPanelComponent } from './ng-jvx-panel/ng-jvx-panel.component';
import {MatListModule} from '@angular/material/list';
import {ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {HttpClientModule} from '@angular/common/http';
import {NgScrollbarModule} from 'ngx-scrollbar';


@NgModule({
  declarations: [NgJvxMultiselectComponent, NgJvxOptionComponent, NgJvxOptionsTemplateDirective, NgJvxPanelComponent],
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
    NgScrollbarModule
  ],
  exports: [NgJvxMultiselectComponent, NgJvxOptionComponent, NgJvxOptionsTemplateDirective]
})
export class NgJvxMultiselectModule { }
