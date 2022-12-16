import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MwStructuresViewComponent } from './components';

const components = [
  MwStructuresViewComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule],
})
export class MapStructuresModule { }