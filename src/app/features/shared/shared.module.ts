import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionCardComponent, ActionCardsPopupComponent, CustomCursorComponent, DescriptionComponent, EventFeedComponent, EventFeedMessageComponent, GameOverPopupComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, ItemDescriptionComponent, ItemIconBaseComponent, ItemIconComponent, ItemSlotComponent, MainButtonComponent, MainMenuPopupComponent, MenuComponent, MwActionHintComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, PlayerMapActionsPanelComponent, PopupContainerComponent, PopupWrapperComponent, RewardPopupComponent, RoundIconBtnComponent, RoundIconComponent, SharedTemplateDirective, SharedTemplatesComponent, SpellDescriptionComponent, SplitUnitsPopupComponent, UnitGroupInfoComponent, UnitGroupInfoPopupComponent, UnitGroupPortraitComponent, UnitGroupSpellIconComponent, UnitSlotsActionPopupComponent, ValueBarComponent, VfxContainerComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { ResourcesCostComponent } from './components/resources-cost/resources-cost.component';
import { DisableContextMenuDirective, MwActionHintDirective, MwCustomCursorDirective, MwUnitEventsCursorDirective, MwUnitGroupCombatActionDirective, NumberModifierDirective } from './directives';
import { MwInfPipe, MwSafeHtmlPipe } from './pipes';

const pipes = [
  MwSafeHtmlPipe,
  MwInfPipe,
];

const directives = [
  MwCustomCursorDirective,
  NumberModifierDirective,
  MwUnitGroupCombatActionDirective,
  MwUnitEventsCursorDirective,
  MwActionHintDirective,
  DisableContextMenuDirective,
];

const components = [
  ...directives,
  ...pipes,

  ResourcesCostComponent,

  ActionCardComponent,
  ActionCardsPopupComponent,

  GameOverPopupComponent,
  SharedTemplateDirective,
  SharedTemplatesComponent,

  DescriptionComponent,

  ItemDescriptionComponent,
  ItemIconBaseComponent,
  ItemIconComponent,
  ItemSlotComponent,

  SpellDescriptionComponent,

  UnitGroupInfoPopupComponent,
  UnitGroupInfoComponent,
  UnitGroupPortraitComponent,
  UnitGroupSpellIconComponent,

  VfxElementComponent,
  VfxLayerComponent,
  CustomCursorComponent,
  VfxContainerComponent,

  EventFeedComponent,
  EventFeedMessageComponent,
  HintsContainerComponent,
  HoverHintComponent,
  MwActionHintComponent,
  MwRaIconComponent,
  PopupContainerComponent,
  PopupWrapperComponent,
  MenuComponent,
  IconBtnComponent,
  MainButtonComponent,
  ValueBarComponent,
  RoundIconComponent,
  RoundIconBtnComponent,

  PlayerMapActionsPanelComponent,
  MwPlayerInfoPanelComponent,
  MwExperienceBarComponent,
  RewardPopupComponent,
  SplitUnitsPopupComponent,
  UnitSlotsActionPopupComponent,
  MainMenuPopupComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule { }
