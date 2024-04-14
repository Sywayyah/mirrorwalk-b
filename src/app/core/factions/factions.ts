
import { AssetsImages } from '../assets';
import { FactionId, registerEntity } from '../entities';
import type { HeroBase } from '../heroes';
import type { UnitBaseType } from '../unit-types';
import { Faction, UnitTypeCreationParams } from './types';

/* might be adjusted in the future */
export const Factions = {
  factionsMap: new Map<string, Faction>(),

  getAllFactions(): Faction[] {
    return [...this.factionsMap.values()];
  },

  createFaction({ id, icon, title }: { id: FactionId, icon: string, title: string; }): Faction {
    if (this.factionsMap.has(id)) {
      throw new Error(`Faction ${id} was already created.`);
    }

    const faction: Faction = {
      id,
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
      defineUnitType(data: UnitTypeCreationParams) {
        const unitType: UnitBaseType = {
          defaultTurnsPerRound: 1,
          ...data,
          mainPortraitUrl: data.mainPortraitUrl ?? AssetsImages.UnitMelee,
          faction: this,
        };

        registerEntity(unitType);

        return unitType;
      },
      findBaseUnitType(upgradedType) {
        /* todo: fix this place later, remove any */
        return Object.values<any>(this.unitTypes).find((unitType: UnitBaseType) => unitType.upgradeDetails?.target === upgradedType.id) as UnitBaseType;
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

    registerEntity(faction);

    this.factionsMap.set(id, faction);

    return faction;
  },
  getFaction(name: string): Faction {
    return this.factionsMap.get(name)!;
  }
} as const;
