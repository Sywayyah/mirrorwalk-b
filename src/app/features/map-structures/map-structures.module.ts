import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HiringRewardPopupComponent, ItemRewardPopupComponent, MapCanvasComponent, MapStructureComponent, MwStructuresViewComponent, PostFightRewardPopupComponent, PreFightPopupComponent, PreviewPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent, UpgradeRewardPopupComponent } from './components';

const components = [
  MwStructuresViewComponent,
  MapStructureComponent,
  MapCanvasComponent,


  HiringRewardPopupComponent,
  ItemRewardPopupComponent,
  PostFightRewardPopupComponent,
  PreFightPopupComponent,
  PreviewPopupComponent,
  ResourcesRewardPopupComponent,
  ScriptedRewardPopupComponent,
  UpgradeRewardPopupComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule],
})
export class MapStructuresModule { }
