import { Component } from '@angular/core';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-market-dialog',
  templateUrl: './market-dialog.component.html',
  styleUrl: './market-dialog.component.scss',
  standalone: false,
})
export class MarketDialogComponent extends BasicPopup<{}> {

}
