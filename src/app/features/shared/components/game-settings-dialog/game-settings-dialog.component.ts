import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { LossMode } from 'src/app/core/game-settings';
import { State } from 'src/app/features/services/state.service';

type LossModeOption = {
  lossMode: LossMode;
  label: string;
};

@Component({
  selector: 'mw-game-settings-dialog',
  templateUrl: './game-settings-dialog.component.html',
  styleUrl: './game-settings-dialog.component.scss',
  standalone: false,
})
export class GameSettingsDialogComponent {
  private readonly state = inject(State);
  private readonly dialogRef = inject(DialogRef);

  private readonly gameSettingsFeature = this.state.gameSettings;
  readonly initialSettings = this.gameSettingsFeature.get();

  readonly lossModes: LossModeOption[] = [
    { label: 'No losses', lossMode: LossMode.None },
    { label: 'Permanent', lossMode: LossMode.Permanent },
  ];

  readonly lossesFromNeutrals = signal(this.initialSettings.lossToNeutrals);
  readonly lossesFromPlayers = signal(this.initialSettings.lossToPlayers);

  accept(): void {
    this.state.gameSettings.patch({
      lossToNeutrals: this.lossesFromNeutrals(),
      lossToNeutralPlayers: this.lossesFromPlayers(),
    });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
