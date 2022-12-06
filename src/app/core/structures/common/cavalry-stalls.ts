import { humansFraction } from '../../fractions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const CalavryStalls: StructureGeneratorModel = createHireStructure(
  'Cavalry Stalls',
  {
    maxUnitGroups: 1,
    minUnitGroups: 1,
    units: [
      [humansFraction.getUnitType('Cavalry'), 4, 4, 1],
    ],
  },
  [
    { unitType: humansFraction.getUnitType('Cavalry'), maxCount: 4 },
  ],
);
