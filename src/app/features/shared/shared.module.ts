import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCursorComponent, HintsContainerComponent, HoverHintComponent, IconBtnComponent, MainButtonComponent, MenuComponent, MwExperienceBarComponent, MwPlayerInfoPanelComponent, MwRaIconComponent, PopupContainerComponent, PopupWrapperComponent, SharedTemplateDirective, SharedTemplatesComponent, ValueBarComponent, VfxElementComponent, VfxLayerComponent } from './components';
import { MwCustomCursorDirective, MwSpellTargetDirective, MwUnitEventsCursorDirective, NumberModifierDirective } from './directives';

const directives = [
  MwCustomCursorDirective,
  NumberModifierDirective,
  MwSpellTargetDirective,
  MwUnitEventsCursorDirective,
];

const components = [
  ...directives,
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
