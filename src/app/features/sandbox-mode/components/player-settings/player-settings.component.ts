import { Component, inject, input, signal } from '@angular/core';
import { UnitBaseType } from 'src/app/core/unit-types';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { DropdownOptionComponent } from '../../../shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { PlayersSettings, SandboxModeContext } from '../../services/sandbox-mode-context.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mw-player-settings',
  imports: [DropdownComponent, DropdownOptionComponent, SharedModule, FormsModule],
  templateUrl: './player-settings.component.html',
  styleUrl: './player-settings.component.scss',
})
export class PlayerSettingsComponent {
  private readonly context = inject(SandboxModeContext);
  readonly settings = input.required<PlayersSettings>();
  readonly playerName = input('');

  readonly activeUnitType = signal<UnitBaseType | null>(null);
  readonly heroes = this.context.heroTypes;
  readonly unitTypes = this.context.unitTypes;

  addUnitType(): void {
    const activeUnitType = this.activeUnitType();
    if (!activeUnitType) {
      return;
    }
    this.settings().units.update(SignalArrUtils.addItem({ count: signal(0), unitType: signal(activeUnitType) }));
  }
}
