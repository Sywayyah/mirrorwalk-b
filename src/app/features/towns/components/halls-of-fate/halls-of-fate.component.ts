import { Component, inject } from '@angular/core';
import { BaseDialog } from 'src/app/core/dialogs';
import { Building } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { PopupService } from 'src/app/features/shared/components';
import { SharedModule } from '../../../shared/shared.module';
import { BuildPopupComponent } from '../build-popup/build-popup.component';

@Component({
  selector: 'mw-halls-of-fate',
  imports: [SharedModule],
  templateUrl: './halls-of-fate.component.html',
  styleUrl: './halls-of-fate.component.scss',
})
export class HallsOfFateComponent extends BaseDialog<{ building: Building }> {
buySpellDialog() {
throw new Error('Method not implemented.');
}
buyItemDialog() {
throw new Error('Method not implemented.');
}
buyActionCardDialog() {
throw new Error('Method not implemented.');
}
  private readonly playersService = inject(MwPlayersService);
  private readonly popupsService = inject(PopupService);

  readonly player = this.playersService.getCurrentPlayer();
  readonly hero = this.player.hero;

  public upgradeBuilding(): void {
    this.close();
    this.popupsService.createBasicPopup({
      component: BuildPopupComponent,
      data: {
        building: this.dialogData.building,
        targetLevel: 2,
      },
      class: 'dark',
    });
  }
}
