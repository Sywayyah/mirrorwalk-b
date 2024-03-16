import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BuildPopupComponent, HiringPopupComponent, TownViewComponent } from './components';
import { ItemsSellingPopupComponent } from './components/items-selling-popup/items-selling-popup.component';

const components = [
  TownViewComponent,
  BuildPopupComponent,
  HiringPopupComponent,
  ItemsSellingPopupComponent,
]

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule],
})
export class TownsModule { }
