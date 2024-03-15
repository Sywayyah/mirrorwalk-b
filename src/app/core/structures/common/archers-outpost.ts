import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const ArchersOutpostStructure: StructureGeneratorModel = createHireStructure({
  id: '#struct-archers-outpost',
  name: 'Archers Outpost',
  guard: {
    maxUnitGroups: 3,
    minUnitGroups: 3,
    units: [
      ['#unit-h10', 8, 11, 3],
    ],
  },
  unitsForHire: [
    { unitTypeId: '#unit-h10', maxCount: 12 },
  ]
},
);
