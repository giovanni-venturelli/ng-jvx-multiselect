import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {NgJvxMultiselectModule} from '../../../ng-jvx-multiselect/src/lib/ng-jvx-multiselect.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgJvxMultiselectModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
