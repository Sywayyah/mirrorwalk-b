import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MwStructuresViewComponent } from './components';
import { MapCanvasComponent } from './components/map-canvas/map-canvas.component';

const components = [
  MwStructuresViewComponent,
  MapCanvasComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule],
})
export class MapStructuresModule { }
