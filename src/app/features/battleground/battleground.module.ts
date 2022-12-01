import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HiringRewardPopupComponent, ItemIconComponent, ItemRewardPopupComponent, MwActionHintComponent, MwBattleHeroAbilitiesComponent, MwExperienceBarComponent, MwGameboardComponent, MwHistoryLogComponent, MwItemsPanelComponent, MwPlayerInfoPanelComponent, MwPlayerResourcesComponent, MwSpellButtonComponent, MwStructuresViewComponent, MwUnitGroupCardComponent, MwUnitGroupsListComponent, PostFightRewardPopupComponent, PreFightPopupComponent, PreviewPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent, UnitGroupBuffComponent, UnitGroupSpellComponent, UpgradeRewardPopup } from './components';

const components = [
  ItemIconComponent,
  MwActionHintComponent,
  MwBattleHeroAbilitiesComponent,
  MwExperienceBarComponent,
  MwGameboardComponent,
  MwHistoryLogComponent,
  MwItemsPanelComponent,
  MwPlayerResourcesComponent,
  MwPlayerInfoPanelComponent,
  HiringRewardPopupComponent,
  ItemRewardPopupComponent,
  PostFightRewardPopupComponent,
  PreFightPopupComponent,
  PreviewPopupComponent,
  ResourcesRewardPopupComponent,
  ScriptedRewardPopupComponent,
  UpgradeRewardPopup,
  MwSpellButtonComponent,
  MwStructuresViewComponent,
  MwUnitGroupCardComponent,
  MwUnitGroupsListComponent,
  UnitGroupBuffComponent,
  UnitGroupSpellComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [SharedModule, CommonModule],
})
export class BattlegroundModule { }
