import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TuxWheelSelectorModule} from '../../../tux-lib/src/lib/wheel-selector/wheel-selector.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuxWheelSelectorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
