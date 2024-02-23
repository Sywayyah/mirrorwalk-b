import { humansFraction } from '../../fractions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const CalavryStalls: StructureGeneratorModel = createHireStructure({
  id: '#struct-cavalry-stalls',
  name: 'Cavalry Stalls',
  guard: {
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Cavalry'), 3, 3, 2],
    ],
  },
  unitsForHire: [
    { unitType: humansFraction.getUnitType('Cavalry'), maxCount: 4 },
  ]
},
);
