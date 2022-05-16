import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
  CardEffectsComponent,
  HiringRewardPopupComponent,
  MwActionHintComponent,
  MwExperienceBarComponent,
  MwGameboardComponent,
  MwHistoryLogComponent,
  MwPlayerResourcesComponent,
  MwPopupContainerComponent,
  MwStructuresViewComponent,
  MwUnitGroupCardComponent,
  MwUnitGroupsListComponent,
  MwViewControlComponent,
  PostFightRewardPopupComponent,
  PreFightPopupComponent,
  ResourcesRewardPopupComponent
} from './feature-sandbox/components';
import { MwBattleHeroAbilitiesComponent } from './feature-sandbox/components/mw-battle-hero-abilities/mw-battle-hero-abilities.component';

@NgModule({
  declarations: [
    AppComponent,
    MwGameboardComponent,
    MwUnitGroupCardComponent,
    MwHistoryLogComponent,
    MwActionHintComponent,
    CardEffectsComponent,
    MwPopupContainerComponent,
    MwViewControlComponent,
    MwStructuresViewComponent,
    MwPlayerResourcesComponent,
    ResourcesRewardPopupComponent,
    HiringRewardPopupComponent,
    PreFightPopupComponent,
    PostFightRewardPopupComponent,
    MwUnitGroupsListComponent,
    MwExperienceBarComponent,
    MwBattleHeroAbilitiesComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
