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
import { MwPopupContainerComponent } from './feature-sandbox/components/mw-popup-container/mw-popup-container.component';

@NgModule({
  declarations: [
    AppComponent,
    MwGameboardComponent,
    MwUnitGroupCardComponent,
    MwHistoryLogComponent,
    MwActionHintComponent,
    CardEffectsComponent,
    MwPopupContainerComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
