
import { AssetsImages } from '../assets';
import type { HeroBase } from '../heroes';
import { FactionId, registerEntity } from '../registries';
import type { UnitBaseType } from '../unit-types';
import { Faction, UnitTypeCreationParams } from './types';

/* might be adjusted in the future */
export const Factions = {
  factionsMap: new Map<string, Faction<any>>(),

  getAllFactions(): Faction<any>[] {
    return [...this.factionsMap.values()];
  },

  createFaction<T extends string>({ id, factionName, icon, title }: { id: FactionId, factionName: string, icon: string, title: string; }): Faction<T> {
    if (this.factionsMap.has(factionName)) {
      throw new Error(`Faction ${factionName} was already created.`);
    }

    const fraction: Faction<T> = {
      id,
      name: factionName,
      unitTypes: {},
      heroes: [],
      title,
      icon,
      townBase: null,
      setTownBase(townBase) {
        this.townBase = townBase;
        registerEntity(townBase);
      },
      getTownBase() {
        return this.townBase;
      },
      defineUnitType(unitTypeName: T, data: UnitTypeCreationParams) {
        const unitType: UnitBaseType = {
          defaultTurnsPerRound: 1,
          ...data,
          fraction: this,
          type: unitTypeName,
        };

        registerEntity(unitType);

        this.unitTypes[unitTypeName] = unitType;

        return unitType;
      },
      findBaseUnitType(upgradedType) {
        /* todo: fix this place later, remove any */
        return Object.values<any>(this.unitTypes).find((unitType: UnitBaseType) => unitType.upgradeDetails?.target === upgradedType.id) as UnitBaseType;
      },
      getUnitType(unitTypeName: T): UnitBaseType {
        return this.unitTypes[unitTypeName]!;
      },
      createHero(
        heroConfig,
      ): HeroBase {
        const {
          id,
          abilities,
          army,
          items,
          name,
          resources,
          stats,
          generalDescription,
          defaultModifiers,
          image
        } = heroConfig;

        const newHero = {
          id,
          name,
          generalDescription,
          initialState: {
            abilities,
            army,
            items,
            resources,
            stats,
            defaultModifiers,
          },
          image: image ?? AssetsImages.HeroMage,
        };

        registerEntity(newHero);

        this.heroes.push(newHero);

        return newHero;
      },
      getAllHeroes(): HeroBase[] {
        return this.heroes;
      }
    };

    registerEntity(fraction);

    this.factionsMap.set(factionName, fraction);

    return fraction;
  },

  getFraction(name: string): Faction<any> {
    return this.factionsMap.get(name)!;
  }
} as const;


export enum FactionsEnum {
  Humans = 'humans',
  Neutrals = 'neutrals',
  Fort = 'fort',
  Constellation = 'constellation',
}
