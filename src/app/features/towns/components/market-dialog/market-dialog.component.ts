import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { resourcesCostInGold, ResourceType } from 'src/app/core/resources';
import { Town } from 'src/app/core/towns';
import { getEntries } from 'src/app/core/utils/common';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

interface ResourceEntry {
  count: WritableSignal<number>;
  name: ResourceType;
  max: number;
}

@Component({
  selector: 'mw-market-dialog',
  templateUrl: './market-dialog.component.html',
  styleUrl: './market-dialog.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketDialogComponent extends BasicPopup<{ town: Town<any> }> {
  readonly playersService = inject(MwPlayersService);
  // readonly playersService = inject();

  readonly currentPlayer = this.playersService.getCurrentPlayer();

  readonly playerResources = signal<ResourceEntry[]>([]);
  readonly marketResources = signal<ResourceEntry[]>([]);

  readonly goldEarned = computed(() =>
    this.playerResources().reduce(
      (total, next) => resourcesCostInGold[next.name] * next.count() + total,
      0,
    ),
  );

  constructor() {
    super();
    this.playerResources.set(
      getEntries(this.currentPlayer.resources).map(([res, count]) => ({
        name: res,
        count: signal(0),
        max: count,
      })),
    );

    this.marketResources.set(
      getEntries(this.data.town.marketState().resources).map(
        ([res, count]) => ({
          name: res,
          count: signal(0),
          max: count,
        }),
      ),
    );
  }
}
