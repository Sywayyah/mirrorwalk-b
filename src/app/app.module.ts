import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MwGameboardComponent } from './feature-sandbox/components/mw-gameboard/mw-gameboard.component';
import { MwUnitGroupCardComponent } from './feature-sandbox/components/mw-unit-group-card/mw-unit-group-card.component';

@NgModule({
  declarations: [
    AppComponent,
    MwGameboardComponent,
    MwUnitGroupCardComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
