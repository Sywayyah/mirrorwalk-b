import { UnitBaseType } from '../unit-types';
import { ActivityTypes, HiringActivity } from './buildings';

export function createHiringActivity<T extends string>(
  unitType: UnitBaseType,
  growth: number,
  unitGrowthGroup: string,
  upgrade: boolean = false,
): HiringActivity {
  return {
    type: ActivityTypes.Hiring,
    hiring: { type: unitType, growth, refillDaysInterval: 7 },
    unitGrowthGroup,
    growth,
    growthIntervalDays: 7,
    upgrade,
  } as HiringActivity;
}
