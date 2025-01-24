import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BuildPopupComponent, GarrisonPopupComponent, HiringPopupComponent, TownViewComponent } from './components';
import { ItemsSellingPopupComponent } from './components/items-selling-popup/items-selling-popup.component';
import { CdkMenuModule } from '@angular/cdk/menu';

const components = [
  GarrisonPopupComponent,
  TownViewComponent,
  BuildPopupComponent,
  HiringPopupComponent,
  ItemsSellingPopupComponent,
]

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule, CdkMenuModule],
})
export class TownsModule { }
