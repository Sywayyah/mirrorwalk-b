import { Entity, FactionId, UnitTypeId } from '../entities';
import type { HeroBase, HeroBaseStats } from '../heroes';
import type { TownBase } from '../towns';
import type { UnitBaseType } from '../unit-types';

/* might be adjusted in the future */

export type UnitTypeCreationParams = Omit<UnitBaseType, 'type' | 'faction'>;

export interface Faction extends Entity {
  id: FactionId;
  heroes: HeroBase[];
  title: string;
  icon: string;
  townBase: TownBase<any> | null;
  unitTypes: Record<UnitTypeId, UnitBaseType>;
  defineUnitType(params: UnitTypeCreationParams): UnitBaseType;
  createHero(config: Pick<HeroBase, 'name' | 'id'> & HeroBaseStats): HeroBase;
  getAllHeroes(): HeroBase[];
  findBaseUnitType(upgradedType: UnitBaseType): UnitBaseType;
  getTownBase(): TownBase<any> | null;
  setTownBase(townBase: TownBase<any>): void;
}
