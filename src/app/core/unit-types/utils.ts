import { Player } from '../players';
import { UnitBaseType, UnitGroup, UnitTypeBaseStatsModel } from './types';

/* unit type, minCount, maxCount, maxGroupsOfThisType */
type UnitModel = [unitType: UnitBaseType, min: number, max: number, maxOfThisType: number | void];

export interface GenerationModel {
  minUnitGroups: number;
  maxUnitGroups: number;
  units: UnitModel[];
}
export const createStats = ([[minDmg, maxDmg], attack, defence, health, speed]: [
  damage: [minDmg: number, maxDmg: number],
  attack: number,
  defence: number,
  health: number,
  speed: number,
]): UnitTypeBaseStatsModel => ({
  damageInfo: {
    minDamage: minDmg,
    maxDamage: maxDmg,
  },
  attackRating: attack,
  defence: defence,
  health,
  speed
});

export const CommonUtils = {
  randIndex<T>(array: Array<T>): number {
    return Math.round((array.length - 1) * Math.random());
  },

  randItem<T>(array: Array<T>): T {
    return array[this.randIndex(array)];
  },

  randIntInRange(from: number, to: number): number {
    const diff = to - from;

    return Math.round(from + (diff * Math.random()));
  },

  randIntTo(to: number): number {
    return Math.round(to * Math.random());
  },

  removeItem<T>(arr: T[], item: T): void {
    const itemIndex = arr.indexOf(item);
    arr.splice(itemIndex, 1);
  },

  randBoolean(): boolean {
    return Math.random() > 0.5;
  },

  chanceRoll(chance: number): boolean {
    return Math.random() < chance;
  },

};

interface GenerationDescription {
  unitType: UnitBaseType;
  min: number;
  max: number;
  maxGroupsOfThisType: number;
  createdTimes: number;
}

interface UnitGenerationModel {
  count: number;
  unitType: UnitBaseType;
}

export const UnitsUtils = {
  createRandomArmy(options: GenerationModel): UnitGenerationModel[] {
    const groupsToGenerateCount = CommonUtils.randIntInRange(options.minUnitGroups, options.maxUnitGroups);
    const generatedGroups = [];
    const unitsToGenerate = [...options.units];

    const unitsMap = unitsToGenerate.reduce((unitGroupsMap, description) => {
      const [unitType, min, max, maxGroupsOfThisType = Infinity] = description;
      unitGroupsMap.set(description, {
        unitType,
        min,
        max,
        maxGroupsOfThisType,
        createdTimes: 0,
      });

      return unitGroupsMap;
    }, new Map<UnitModel, GenerationDescription>());

    console.log('options ->>', options);
    console.log('Units Map ->>', unitsMap);

    for (let i = 0; i < groupsToGenerateCount; i++) {
      const randUnitDescr = CommonUtils.randItem(unitsToGenerate);
      const unit = unitsMap.get(randUnitDescr)!;
      const unitType = unit.unitType;

      const count = CommonUtils.randIntInRange(unit.min, unit.max);

      const newUnitGroup: UnitGenerationModel = {
        count: count,
        unitType,
      };

      generatedGroups.push(newUnitGroup);

      unit.createdTimes++;

      if (unit.createdTimes >= unit.maxGroupsOfThisType) {
        console.log('this unit was generated max times')
        unitsMap.delete(randUnitDescr);
        CommonUtils.removeItem(unitsToGenerate, randUnitDescr)
      }
    }

    console.log('generated groups', generatedGroups);

    return generatedGroups;
  },
}
