import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  NgJvxDisabledOptionDirective,
  NgJvxMultisectChipComponent,
  NgJvxMultiselectComponent,
  NgJvxOptionsTemplateDirective, NgJvxSelectionTemplateDirective
} from 'ng-jvx-multiselect';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {CommonModule} from '@angular/common';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
  imports: [BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, NgJvxMultiselectComponent, NgJvxOptionsTemplateDirective, NgJvxDisabledOptionDirective, NgJvxMultisectChipComponent, NgJvxSelectionTemplateDirective], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
