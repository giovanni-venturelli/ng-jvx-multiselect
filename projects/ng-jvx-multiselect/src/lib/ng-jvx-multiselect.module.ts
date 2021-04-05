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


@NgModule({
  declarations: [NgJvxMultiselectComponent, NgJvxOptionComponent, NgJvxOptionsTemplateDirective],
  imports: [
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    CommonModule,
    MatIconModule
  ],
  exports: [NgJvxMultiselectComponent, NgJvxOptionComponent, NgJvxOptionsTemplateDirective]
})
export class NgJvxMultiselectModule { }
