import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
  HiringRewardPopupComponent,
  MwActionHintComponent,
  MwExperienceBarComponent,
  MwGameboardComponent,
  MwHistoryLogComponent,
  MwPlayerResourcesComponent,
  MwPopupContainerComponent,
  MwStructuresViewComponent,
  MwUnitGroupCardComponent,
  MwUnitGroupsListComponent,
  MwViewControlComponent,
  PostFightRewardPopupComponent,
  PreFightPopupComponent,
  MwBattleHeroAbilitiesComponent,
  ResourcesRewardPopupComponent,
  MwPlayerInfoPanelComponent,
  HintsContainerComponent,
  HoverHintComponent,
} from './feature-sandbox/components';
import { MwSpellTargetDirective } from './feature-sandbox/directives/mw-spell-target.directive';
import { MwItemsPanelComponent } from './feature-sandbox/components/mw-items-panel/mw-items-panel.component';
import { MwRaIconComponent } from './feature-sandbox/components/ui-elements/mw-ra-icon/mw-ra-icon.component';
import { ItemRewardPopupComponent } from './feature-sandbox/components/mw-popup-container/components/item-reward-popup/item-reward-popup.component';
import { ItemIconComponent } from './feature-sandbox/components/item-icon/item-icon.component';
import { PreviewPopupComponent } from './feature-sandbox/components/mw-popup-container/components/preview-popup/preview-popup.component';
import { VfxElementComponent } from './feature-sandbox/components/ui-elements/vfx-element/vfx-element.component';
import { VfxLayerComponent } from './feature-sandbox/components/ui-elements/vfx-layer/vfx-layer.component';
import { UpgradeRewardPopup } from './feature-sandbox/components/mw-popup-container/components/upgrade-reward-popup/upgrade-reward-popup.component';
import { MwCustomCursorDirective } from './feature-sandbox/directives/mw-custom-cursor.directive';
import { MwUnitEventsCursorDirective } from './feature-sandbox/directives/mw-unit-events-cursor.directive';
import { SharedTemplatesComponent } from './feature-sandbox/components/ui-elements/shared-templates/shared-templates.component';
import { SharedTemplateDirective } from './feature-sandbox/components/ui-elements/shared-templates/shared-template.directive';
import { CustomCursorComponent } from './feature-sandbox/components/ui-elements/custom-cursor/custom-cursor.component';
import { NumberModifierDirective } from './feature-sandbox/directives/mw-modifier.directive';
import { ValueBarComponent } from './feature-sandbox/components/ui-elements/value-bar/value-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MwGameboardComponent,
    MwUnitGroupCardComponent,
    MwHistoryLogComponent,
    MwActionHintComponent,
    MwPopupContainerComponent,
    MwViewControlComponent,
    MwStructuresViewComponent,
    MwPlayerResourcesComponent,
    UpgradeRewardPopup,
    ResourcesRewardPopupComponent,
    HiringRewardPopupComponent,
    PreFightPopupComponent,
    PostFightRewardPopupComponent,
    MwUnitGroupsListComponent,
    MwExperienceBarComponent,
    MwBattleHeroAbilitiesComponent,
    MwPlayerInfoPanelComponent,
    HoverHintComponent,
    HintsContainerComponent,
    MwSpellTargetDirective,
    MwItemsPanelComponent,
    MwRaIconComponent,
    ItemRewardPopupComponent,
    ItemIconComponent,
    PreviewPopupComponent,
    VfxElementComponent,
    VfxLayerComponent,
    MwCustomCursorDirective,
    MwUnitEventsCursorDirective,
    SharedTemplatesComponent,
    SharedTemplateDirective,
    CustomCursorComponent,
    NumberModifierDirective,
    ValueBarComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
