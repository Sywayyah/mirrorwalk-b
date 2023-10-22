import { humansFraction } from '../../fractions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const CalavryStalls: StructureGeneratorModel = createHireStructure(
  'Cavalry Stalls',
  {
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Cavalry'), 3, 3, 2],
    ],
  },
  [
    { unitType: humansFraction.getUnitType('Cavalry'), maxCount: 4 },
  ],
);
