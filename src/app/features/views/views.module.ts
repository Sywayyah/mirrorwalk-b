import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BattlegroundModule } from '../battleground/battleground.module';
import { SharedModule } from '../shared/shared.module';
import { MwViewControlComponent } from './components';

const components = [
  MwViewControlComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule, BattlegroundModule],
})
export class ViewsModule { }
