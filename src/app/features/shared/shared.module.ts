import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCursorComponent, DescriptionComponent, EventFeedComponent, EventFeedMessageComponent, GameOverPopupComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, ItemDescriptionComponent, MainButtonComponent, MenuComponent, MwActionHintComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, PopupContainerComponent, PopupWrapperComponent, RewardPopupComponent, SharedTemplateDirective, SharedTemplatesComponent, SpellDescriptionComponent, UnitGroupInfoComponent, UnitGroupInfoPopupComponent, UnitGroupPortraitComponent, UnitGroupSpellIconComponent, ValueBarComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { DisableContextMenuDirective, MwActionHintDirective, MwCustomCursorDirective, MwUnitEventsCursorDirective, MwUnitGroupCombatActionDirective, NumberModifierDirective } from './directives';

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

  GameOverPopupComponent,
  SharedTemplateDirective,
  SharedTemplatesComponent,

  DescriptionComponent,
  ItemDescriptionComponent,
  SpellDescriptionComponent,
  UnitGroupInfoPopupComponent,
  UnitGroupInfoComponent,
  UnitGroupPortraitComponent,
  UnitGroupSpellIconComponent,

  VfxElementComponent,
  VfxLayerComponent,
  CustomCursorComponent,

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

  MwPlayerInfoPanelComponent,
  MwExperienceBarComponent,
  RewardPopupComponent,

];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule { }
