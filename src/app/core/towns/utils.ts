import { UnitTypeId, registerEntity } from '../entities';
import { ActivityTypes, BuidlingBase, HiringActivity } from './buildings';

export function createBuildingType(building: BuidlingBase): BuidlingBase {
  registerEntity(building);

  return building;
}

export function createHiringActivity(
  unitType: UnitTypeId,
  growth: number,
  unitGrowthGroup: string,
  upgrade: boolean = false,
): HiringActivity {
  return {
    type: ActivityTypes.Hiring,
    hiring: { unitTypeId: unitType, growth, refillDaysInterval: 7 },
    unitGrowthGroup,
    growth,
    growthIntervalDays: 7,
    upgrade,
  } as HiringActivity;
}
