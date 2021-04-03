import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgJvxMultiselectModule} from 'ng-jvx-multiselect';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        NgJvxMultiselectModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
