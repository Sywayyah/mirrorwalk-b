import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MwStructuresViewComponent } from './components';


@NgModule({
  declarations: [MwStructuresViewComponent],
  exports: [MwStructuresViewComponent],
  imports: [CommonModule, SharedModule],
})
export class MapStructuresModule { }
