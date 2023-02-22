import { humansFraction } from '../../fractions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const ArchersOutpostStructure: StructureGeneratorModel = createHireStructure(
  'Archers Outpost',
  {
    maxUnitGroups: 3,
    minUnitGroups: 3,
    units: [
      [humansFraction.getUnitType('Archer'), 8, 11, 3],
    ],
  },
  [
    { unitType: humansFraction.getUnitType('Archer'), maxCount: 12 },
  ],
);
