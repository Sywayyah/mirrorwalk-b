import type { HeroBase, HeroBaseStats } from '../heroes';
import { Entity, FactionId } from '../registries';
import type { TownBase } from '../towns';
import type { UnitBaseType } from '../unit-types';

/* might be adjusted in the future */

export type UnitTypeCreationParams = Omit<UnitBaseType, 'type' | 'fraction'>;

export interface Fraction<T extends string> extends Entity {
  id: FactionId;
  name: string;
  heroes: HeroBase[];
  title: string;
  icon: string;
  townBase: TownBase<any> | null;
  unitTypes: { [key in T]?: UnitBaseType };
  defineUnitType(unitTypeName: T, params: UnitTypeCreationParams): UnitBaseType;
  getUnitType(unitTypeName: T): UnitBaseType;
  createHero(config: Pick<HeroBase, 'name' | 'id'> & HeroBaseStats): HeroBase;
  getAllHeroes(): HeroBase[];
  findBaseUnitType(upgradedType: UnitBaseType): UnitBaseType;
  getTownBase(): TownBase<any> | null;
  setTownBase(townBase: TownBase<any>): void;
}
