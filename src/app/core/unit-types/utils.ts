import { UnitTypeId, resolveEntity } from '../entities';
import { DescriptionElement } from '../ui';
import { CommonUtils } from '../utils';
import { UnitBaseType, UnitDescriptions, UnitTypeBaseStatsModel } from './types';

/* unit type, minCount, maxCount, maxGroupsOfThisType */
type UnitModel = [unitType: UnitTypeId, min: number, max: number, maxOfThisType: number | void];

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



interface GenerationDescription {
  unitType: UnitTypeId;
  min: number;
  max: number;
  maxGroupsOfThisType: number;
  createdTimes: number;
}

interface UnitGenerationModel {
  count: number;
  unitType: UnitTypeId;
}

export function resolveUnitType(unitTypeId: UnitTypeId): UnitBaseType {
  return resolveEntity(unitTypeId);
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


export const simpleDescriptions = (descriptions: DescriptionElement[]): () => UnitDescriptions => {
  return () => ({
    descriptions,
  });
};
