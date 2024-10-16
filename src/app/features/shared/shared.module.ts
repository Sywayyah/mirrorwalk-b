import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionCardComponent, ActionCardsPopupComponent, CustomCursorComponent, DescriptionComponent, EventFeedComponent, EventFeedMessageComponent, GameOverPopupComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, ItemDescriptionComponent, ItemIconBaseComponent, ItemIconComponent, ItemSlotComponent, MainButtonComponent, MainMenuPopupComponent, MenuComponent, MwActionHintComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, MwUnitGroupsListComponent, PlayerMapActionsPanelComponent, PopupBaseContentComponent, PopupContainerComponent, PopupWrapperComponent, RewardPopupComponent, RoundIconBtnComponent, RoundIconComponent, SharedTemplateDirective, SharedTemplatesComponent, SpellDescriptionComponent, SplitUnitsPopupComponent, UnitGroupInfoComponent, UnitGroupInfoPopupComponent, UnitGroupPortraitComponent, UnitGroupPreviewComponent, UnitGroupSpellIconComponent, UnitSlotsActionPopupComponent, ValueBarComponent, VfxContainerComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { ActionCardItemStackComponent } from './components/action-card-stack-item/action-card-item.component';
import { ResourcesCostComponent } from './components/resources-cost/resources-cost.component';
import { DisableContextMenuDirective, MwActionHintDirective, MwCustomCursorDirective, MwUnitEventsCursorDirective, MwUnitGroupCombatActionDirective, NumberModifierDirective } from './directives';
import { MwEntityPipe, MwInfPipe, MwSafeHtmlPipe } from './pipes';
import { GradientImgComponent } from './components/gradient-img/gradient-img.component';

const pipes = [
  MwEntityPipe,
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
  ActionCardItemStackComponent,

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
  MwUnitGroupsListComponent,
  UnitGroupPreviewComponent,

  VfxElementComponent,
  VfxLayerComponent,
  CustomCursorComponent,
  VfxContainerComponent,

  GradientImgComponent,

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

  PopupBaseContentComponent,
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
