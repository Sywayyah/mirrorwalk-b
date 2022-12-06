import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCursorComponent, HintsContainerComponent, HoverHintComponent, MainButtonComponent, MenuComponent, MwRaIconComponent, PopupContainerComponent, PopupWrapperComponent, SharedTemplateDirective, SharedTemplatesComponent, ValueBarComponent, VfxElementComponent, VfxLayerComponent } from './components';
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
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule { }
