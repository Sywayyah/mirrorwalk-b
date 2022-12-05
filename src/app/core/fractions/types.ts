import { HeroBase, HeroBaseStats } from '../heroes';
import type { UnitBase } from '../unit-types';

/* might be adjusted in the future */

export type UnitTypeCreationParams = Omit<UnitBase, 'type' | 'fraction'>;

export interface Fraction<T extends string> {
  name: string;
  heroes: HeroBase[];
  title: string;
  unitTypes: { [key in T]?: UnitBase };
  defineUnitType(unitTypeName: T, params: UnitTypeCreationParams): UnitBase;
  getUnitType(unitTypeName: T): UnitBase;
  createHero(config: Pick<HeroBase, 'name'> & HeroBaseStats): HeroBase;
  getAllHeroes(): HeroBase[];
}
