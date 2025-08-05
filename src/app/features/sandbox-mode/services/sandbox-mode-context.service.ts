import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { EntitiesRegisty } from 'src/app/core/entities';
import { HeroBase } from 'src/app/core/heroes';
import { ItemBaseType } from 'src/app/core/items';
import { SpellBaseType } from 'src/app/core/spells';
import { UnitBaseType } from 'src/app/core/unit-types';

export class PlayersSettings {
  readonly hero = signal<HeroBase | null>(null);

  readonly heroItems = signal<ItemBaseType[]>([]);

  readonly units = signal<{ unitType: WritableSignal<UnitBaseType>; count: WritableSignal<number> }[]>([]);

  readonly canStart = computed(() => this.hero() && this.units().length);
}

@Injectable({ providedIn: 'root' })
export class SandboxModeContext {
  private readonly registry = EntitiesRegisty;

  readonly unitTypes = this.registry.getRegisteredEntitiesMap().get('#unit') as UnitBaseType[];
  readonly heroTypes = this.registry.getRegisteredEntitiesMap().get('#hero') as HeroBase[];
  readonly itemTypes = this.registry.getRegisteredEntitiesMap().get('#item') as ItemBaseType[];
  readonly spellTypes = this.registry.getRegisteredEntitiesMap().get('#spell') as SpellBaseType[];

  readonly currentPlayerSettings = new PlayersSettings();
  readonly opponentPlayerSettings = new PlayersSettings();
}
