import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HiringRewardPopupComponent, ItemIconComponent, ItemRewardPopupComponent, MwActionHintComponent, MwBattleHeroAbilitiesComponent, MwGameboardComponent, MwHistoryLogComponent, MwItemsPanelComponent, MwPlayerResourcesComponent, MwSpellButtonComponent, MwUnitGroupCardComponent, MwUnitGroupsListComponent, PostFightRewardPopupComponent, PreFightPopupComponent, PreviewPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent, UnitGroupBuffComponent, UnitGroupSpellComponent, UpgradeRewardPopup } from './components';
import { HeroPopupComponent } from './components/hero-popup/hero-popup.component';
import { ItemIconBaseComponent } from './components/item-icon-base/item-icon-base.component';
import { ItemSlotComponent } from './components/item-slot/item-slot.component';

const components = [
  ItemIconComponent,
  MwActionHintComponent,
  MwBattleHeroAbilitiesComponent,
  MwGameboardComponent,
  MwHistoryLogComponent,
  MwItemsPanelComponent,
  MwPlayerResourcesComponent,
  HiringRewardPopupComponent,
  ItemRewardPopupComponent,
  PostFightRewardPopupComponent,
  ItemSlotComponent,
  ItemIconBaseComponent,
  HeroPopupComponent,
  PreFightPopupComponent,
  PreviewPopupComponent,
  ResourcesRewardPopupComponent,
  ScriptedRewardPopupComponent,
  UpgradeRewardPopup,
  MwSpellButtonComponent,
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
