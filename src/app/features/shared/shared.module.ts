import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCursorComponent, DescriptionComponent, EventFeedComponent, EventFeedMessageComponent, GameOverPopupComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, ItemDescriptionComponent, MainButtonComponent, MenuComponent, MwActionHintComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, PopupContainerComponent, PopupWrapperComponent, RewardPopupComponent, SharedTemplateDirective, SharedTemplatesComponent, SpellDescriptionComponent, ValueBarComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { MwActionHintDirective, MwCustomCursorDirective, MwUnitGroupCombatActionDirective, MwUnitEventsCursorDirective, NumberModifierDirective } from './directives';

const directives = [
  MwCustomCursorDirective,
  NumberModifierDirective,
  MwUnitGroupCombatActionDirective,
  MwUnitEventsCursorDirective,
  MwActionHintDirective,
];

const components = [
  ...directives,
  MwActionHintComponent,
  GameOverPopupComponent,
  EventFeedComponent,
  EventFeedMessageComponent,
  CustomCursorComponent,
  HintsContainerComponent,
  HoverHintComponent,
  MwRaIconComponent,
  PopupContainerComponent,
  MainButtonComponent,
  PopupWrapperComponent,
  SharedTemplateDirective,
  SharedTemplatesComponent,
  ValueBarComponent,
  DescriptionComponent,
  ItemDescriptionComponent,
  SpellDescriptionComponent,
  VfxElementComponent,
  VfxLayerComponent,
  MenuComponent,
  MwPlayerInfoPanelComponent,
  MwExperienceBarComponent,
  IconBtnComponent,
  RewardPopupComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule { }
