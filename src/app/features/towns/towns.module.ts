import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TownViewComponent } from './components';

const components = [
  TownViewComponent,
]

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule],
})
export class TownsModule { }
