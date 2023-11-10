import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionCardComponent, ActionCardsPopupComponent, CustomCursorComponent, DescriptionComponent, EventFeedComponent, EventFeedMessageComponent, GameOverPopupComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, ItemDescriptionComponent, ItemIconBaseComponent, ItemIconComponent, ItemSlotComponent, MainButtonComponent, MenuComponent, MwActionHintComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, PlayerMapActionsPanelComponent, PopupContainerComponent, PopupWrapperComponent, RewardPopupComponent, SharedTemplateDirective, SharedTemplatesComponent, SpellDescriptionComponent, SplitUnitsPopupComponent, UnitGroupInfoComponent, UnitGroupInfoPopupComponent, UnitGroupPortraitComponent, UnitGroupSpellIconComponent, UnitSlotsActionPopupComponent, ValueBarComponent, VfxContainerComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { DisableContextMenuDirective, MwActionHintDirective, MwCustomCursorDirective, MwSafeHtmlPipe, MwUnitEventsCursorDirective, MwUnitGroupCombatActionDirective, NumberModifierDirective } from './directives';

const pipes = [
  MwSafeHtmlPipe,
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

  PlayerMapActionsPanelComponent,
  MwPlayerInfoPanelComponent,
  MwExperienceBarComponent,
  RewardPopupComponent,
  SplitUnitsPopupComponent,
  UnitSlotsActionPopupComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule { }
