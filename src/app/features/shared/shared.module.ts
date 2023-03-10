import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCursorComponent, DescriptionComponent, GameOverPopupComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, ItemDescriptionComponent, MainButtonComponent, MenuComponent, MwActionHintComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, PopupContainerComponent, PopupWrapperComponent, SharedTemplateDirective, SharedTemplatesComponent, SpellDescriptionComponent, ValueBarComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { MwActionHintDirective, MwCustomCursorDirective, MwSpellTargetDirective, MwUnitEventsCursorDirective, NumberModifierDirective } from './directives';

const directives = [
  MwCustomCursorDirective,
  NumberModifierDirective,
  MwSpellTargetDirective,
  MwUnitEventsCursorDirective,
  MwActionHintDirective,
];

const components = [
  ...directives,
  MwActionHintComponent,
  GameOverPopupComponent,
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
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule { }
