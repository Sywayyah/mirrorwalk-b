
import { AssetsImages } from '../assets';
import type { HeroBase } from '../heroes';
import { FactionId, registerEntity } from '../registries';
import type { UnitBaseType } from '../unit-types';
import { Fraction, UnitTypeCreationParams } from './types';

/* might be adjusted in the future */
export const Fractions = {
  fractionsMap: new Map<string, Fraction<any>>(),

  getAllFractions(): Fraction<any>[] {
    return [...this.fractionsMap.values()];
  },

  createFraction<T extends string>({ id, fractionName, icon, title }: { id: FactionId, fractionName: string, icon: string, title: string; }): Fraction<T> {
    if (this.fractionsMap.has(fractionName)) {
      throw new Error(`Fraction ${fractionName} was already created.`);
    }

    const fraction: Fraction<T> = {
      id,
      name: fractionName,
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

    this.fractionsMap.set(fractionName, fraction);

    return fraction;
  },

  getFraction(name: string): Fraction<any> {
    return this.fractionsMap.get(name)!;
  }
} as const;


export enum FractionsEnum {
  Humans = 'humans',
  Neutrals = 'neutrals',
  Fort = 'fort',
  Constellation = 'constellation',
}
