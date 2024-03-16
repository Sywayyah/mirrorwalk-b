import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const CalavryStalls: StructureGeneratorModel = createHireStructure({
  id: '#struct-cavalry-stalls',
  name: 'Cavalry Stalls',
  guard: {
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      ['#unit-h30', 3, 3, 2],
    ],
  },
  unitsForHire: [
    { unitTypeId: '#unit-h30', maxCount: 4 },
  ]
},
);
