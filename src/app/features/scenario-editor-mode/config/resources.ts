import { signal } from '@angular/core';
import { Resources } from 'src/app/core/resources';

export class CustomResources {
  readonly gold = signal(100);
  readonly wood = signal(0);
  readonly gems = signal(0);
  readonly crystals = signal(0);

  constructor({ gold = 0, gems = 0, redCrystals = 0, wood = 0 }: Resources = {}) {
    this.gold.set(gold);
    this.wood.set(wood);
    this.gems.set(gems);
    this.crystals.set(redCrystals);
  }
}
