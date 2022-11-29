import type { UnitBase } from '../unit-types';

/* might be adjusted in the future */

export type UnitTypeCreationParams = Omit<UnitBase, 'type' | 'fraction'>;

export interface Fraction<T extends string> {
  name: string;
  unitTypes: { [key in T]?: UnitBase };
  defineUnitType(unitTypeName: T, params: UnitTypeCreationParams): UnitBase;
  getUnitType(unitTypeName: T): UnitBase;
}

export const Fractions = {
  fractionsMap: new Map<string, Fraction<any>>(),

  createFraction<T extends string>(fractionName: string): Fraction<T> {
    if (this.fractionsMap.has(fractionName)) {
      throw new Error(`Fraction ${fractionName} was already created.`);
    }

    const fraction: Fraction<T> = {
      name: fractionName,
      unitTypes: {},
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
    };

    this.fractionsMap.set(fractionName, fraction);

    return fraction;
  },

  getFraction(name: string): Fraction<any> {
    return this.fractionsMap.get(name)!;
  }
} as const;

