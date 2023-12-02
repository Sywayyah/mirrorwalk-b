import { Component, inject } from '@angular/core';
import { Building, SellingBuildingData } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-items-selling-popup',
  templateUrl: './items-selling-popup.component.html',
  styleUrl: './items-selling-popup.component.scss',
})
export class ItemsSellingPopupComponent extends BasicPopup<{ building: Building }> {
  readonly players = inject(MwPlayersService);

  readonly hero = this.players.getCurrentPlayer().hero;

  private readonly sellingData = this.data.building.getCustomData<SellingBuildingData>();

  items = this.sellingData?.items;
  allowsSelling = this.sellingData?.selling;
}
