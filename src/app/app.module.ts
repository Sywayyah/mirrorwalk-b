import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  MwGameboardComponent,
  MwUnitGroupCardComponent,
  MwHistoryLogComponent,
  CardEffectsComponent,
} from './feature-sandbox/components';
import { MwActionHintComponent } from './feature-sandbox/components/mw-action-hint/mw-action-hint.component';

@NgModule({
  declarations: [
    AppComponent,
    MwGameboardComponent,
    MwUnitGroupCardComponent,
    MwHistoryLogComponent,
    MwActionHintComponent,
    CardEffectsComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
