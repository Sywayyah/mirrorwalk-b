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

  addToResource(resType: ResourceType, count: number) {
    this.resources[resType] += count;
    this.goldEntry.max += count;
  }

  addToResources(resources: Resources): void {
    getEntries(resources).forEach(([resType, count]) => {
      this.resources[resType] += count!;
    });
  }

  removeResources(resources: Resources): void {
    getEntries(resources).forEach(([resType, count]) => {
      this.resources[resType] -= count!;
      const resourceEntry = this.getResourceEntry(resType)!;
      resourceEntry.max -= count!;
      resourceEntry.count.set(0);
    });
  }

  addResources(resources: Resources): void {
    getEntries(resources).forEach(([resType, count]) => {
      this.resources[resType] += count!;
      const resourceEntry = this.getResourceEntry(resType)!;
      resourceEntry.max += count!;
      resourceEntry.count.set(0);
    });
  }

  addMaxResources(resources: Resources, sold: boolean): void {
    getEntries(resources).forEach(([resType, count]) => {
      const entry = this.getResourceEntry(resType)!;

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

  private getResourceEntry(resType: ResourceType) {
    return this.resourceEntries().find(
      (entry) => entry.resType === resType
    );
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

  // revise and simplify
  getCountsAsResources(skipGold = false): Resources {
    return this.resourceEntries().reduce((resources, entry) => {
      resources[entry.resType] = entry.isGold
        ? skipGold ? 0 : this.costInGold()
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
    { title: 'Your Gold', trader: this.playerTrader },
    { title: 'Market Gold', trader: this.marketTrader },
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

  readonly dealResources = computed(() => {
    const playerCounts = this.playerTrader.getCountsAsResources(true);
    const marketCounts = this.marketTrader.getCountsAsResources(true);

    return getEntries(marketCounts).map(([resType, count]) => {
      return { resType, count: count! - playerCounts[resType]! };
    }).filter(res => res.count && res.resType !== ResourceType.Gold);
  });

  trade(): void {
    const playerTrader = this.playerTrader;
    const marketTrader = this.marketTrader;

    const playerCounts = playerTrader.getCountsAsResources(true);
    const marketCounts = marketTrader.getCountsAsResources(true);

    playerTrader.addToResource(ResourceType.Gold, this.dealCost());
    marketTrader.addToResource(ResourceType.Gold, this.dealCost() * -1);
    console.log(playerCounts, marketCounts);
    playerTrader.removeResources(playerCounts);
    marketTrader.removeResources(marketCounts);
    playerTrader.addResources(marketCounts);
    marketTrader.addResources(playerCounts);
  }
}
