
import type { HeroBase } from '../heroes';
import type { UnitBase } from '../unit-types';
import { Fraction } from './types';

/* might be adjusted in the future */
export const Fractions = {
  fractionsMap: new Map<string, Fraction<any>>(),

  getAllFractions(): Fraction<any>[] {
    return [...this.fractionsMap.values()];
  },

  createFraction<T extends string>(fractionName: string, { icon, title }: {
    title: string,
    icon: string,
  }): Fraction<T> {
    if (this.fractionsMap.has(fractionName)) {
      throw new Error(`Fraction ${fractionName} was already created.`);
    }

    const fraction: Fraction<T> = {
      name: fractionName,
      unitTypes: {},
      heroes: [],
      title,
      icon,
      town: null,
      setTownBase(townBase) {
        this.town = townBase;
      },
      getTownBase() {
        return this.town;
      },
      defineUnitType(unitTypeName: T, data) {
        const unitType = {
          ...data,
          fraction: this,
          type: unitTypeName,
        };

        this.unitTypes[unitTypeName] = unitType;

        return unitType;
      },
      getUnitType(unitTypeName: T): UnitBase {
        return this.unitTypes[unitTypeName]!;
      },
      createHero(
        heroConfig,
      ): HeroBase {
        const {
          abilities,
          army,
          items,
          name,
          resources,
          stats,
        } = heroConfig;

        const newHero = {
          name,
          initialState: {
            abilities,
            army,
            items,
            resources,
            stats,
          },
        };

        this.heroes.push(newHero);

        return newHero;
      },
      getAllHeroes(): HeroBase[] {
        return this.heroes;
      }
    };

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
  Constellation = 'constellation',
}
