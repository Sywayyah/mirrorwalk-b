import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Resources,
  resourcesCostInGold,
  ResourcesModel,
  ResourceType,
} from 'src/app/core/resources';
import { Town } from 'src/app/core/towns';
import { getEntries } from 'src/app/core/utils/common';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

interface ResourceEntry {
  count: WritableSignal<number>;
  resType: ResourceType;
  max: number;
  isGold?: boolean;
}

class ResourceTrader {
  readonly resourceEntries = signal<ResourceEntry[]>([]);

  readonly goldEntry: ResourceEntry;

  readonly costInGold = computed(() =>
    this.resourceEntries().reduce(
      (total, resEntry) =>
        resourcesCostInGold[resEntry.resType] * resEntry.count() + total,
      0,
    ),
  );

  // increase costs for selling
  constructor(
    private readonly resources: ResourcesModel,
    private readonly multipliers?: Record<ResourceType, number>,
  ) {
    this.resourceEntries.set(
      getEntries(resources).map(([res, count]) => ({
        resType: res,
        count: signal(0),
        max: count,
      })),
    );

    this.goldEntry = this.resourceEntries().find(
      (entry) => entry.resType === ResourceType.Gold,
    )!;

    this.goldEntry.isGold = true;
  }

  applyCounts(): void {
    this.resourceEntries().forEach((entry) => {
      const prevCount = entry.count();
      entry.max -= prevCount;
      entry.count.set(0);
    });
  }

  addToResources(resources: Resources): void {
    getEntries(resources).forEach(([resType, count]) => {
      this.resources[resType] += count!;
    });
  }

  addMaxResources(resources: Resources, sold: boolean): void {
    getEntries(resources).forEach(([resType, count]) => {
      const entry = this.resourceEntries().find(
        (entry) => entry.resType === resType,
      )!;

      if (entry.isGold) {
        if (sold) {
          entry.max -= count!;
        } else {
          entry.max += count!;
        }
      } else {
        if (sold) {
          entry.max += count!;
        } else {
          entry.max -= count!;
        }
      }
    });
  }

  getCountsAsResourcesDiff(selling = false): Resources {
    return this.resourceEntries().reduce((resources, entry) => {
      resources[entry.resType] = entry.isGold
        ? this.costInGold()
        : entry.count();

      if (selling) {
        if (entry.isGold) {
          resources[entry.resType] = -resources[entry.resType]!;
        }
      } else {
        if (!entry.isGold) {
          resources[entry.resType] = -resources[entry.resType]!;
        }
      }

      return resources;
    }, {} as Resources);
  }

  getCountsAsResources(): Resources {
    return this.resourceEntries().reduce((resources, entry) => {
      resources[entry.resType] = entry.isGold
        ? this.costInGold()
        : entry.count();

      return resources;
    }, {} as Resources);
  }
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

  readonly currentPlayer = this.playersService.getCurrentPlayer();

  readonly playerTrader = new ResourceTrader(this.currentPlayer.resources);
  readonly marketTrader = new ResourceTrader(
    this.data.town.marketState().resources,
  );

  readonly traders = [
    { title: 'Selling', trader: this.playerTrader },
    { title: 'Buying', trader: this.marketTrader },
  ];

  readonly dealCost = computed(
    () => this.playerTrader.costInGold() - this.marketTrader.costInGold(),
  );

  readonly canTrade = computed(() => {
    const dealCost = this.dealCost();

    if (
      dealCost === 0 &&
      (this.marketTrader.costInGold() === 0 ||
        this.playerTrader.costInGold() === 0)
    ) {
      return false;
    }

    if (dealCost < 0) {
      return (
        this.playerTrader.goldEntry.max + this.marketTrader.goldEntry.count() >=
        Math.abs(dealCost)
      );
    }

    return (
      this.marketTrader.goldEntry.max + this.playerTrader.goldEntry.count() >=
      Math.abs(dealCost)
    );
  });

  getResourcesFromEntries(entries: ResourceEntry[]): Resources {
    return entries.reduce(
      (acc, next) => ((acc[next.resType] = next.count()), acc),
      {} as Resources,
    );
  }

  trade(): void {
    const purchasedResourcesDiff =
      this.marketTrader.getCountsAsResourcesDiff(true);
    const soldResourcesDiff = this.playerTrader.getCountsAsResourcesDiff();

    this.playersService.addResourcesToPlayer(
      this.currentPlayer,
      purchasedResourcesDiff,
    );
    this.playersService.addResourcesToPlayer(
      this.currentPlayer,
      soldResourcesDiff,
    );

    console.log(soldResourcesDiff, purchasedResourcesDiff);

    // todo: fix
    this.marketTrader.addToResources(soldResourcesDiff);
    this.marketTrader.addToResources(purchasedResourcesDiff);

    this.marketTrader.applyCounts();
    this.playerTrader.applyCounts();

    this.marketTrader.addMaxResources(soldResourcesDiff, false);
    this.playerTrader.addMaxResources(purchasedResourcesDiff, true);
  }
}
