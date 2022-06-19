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
  MwBattleHeroAbilitiesComponent,
  ResourcesRewardPopupComponent,
  MwPlayerInfoPanelComponent,
  HintsContainerComponent,
  HoverHintComponent,
} from './feature-sandbox/components';
import { MwSpellTargetDirective } from './feature-sandbox/directives/mw-spell-target.directive';
import { MwItemsPanelComponent } from './feature-sandbox/components/mw-items-panel/mw-items-panel.component';
import { MwRaIconComponent } from './feature-sandbox/components/ui-elements/mw-ra-icon/mw-ra-icon.component';

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
    MwPlayerInfoPanelComponent,
    HoverHintComponent,
    HintsContainerComponent,
    MwSpellTargetDirective,
    MwItemsPanelComponent,
    MwRaIconComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
