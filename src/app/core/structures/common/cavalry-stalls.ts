import { humansFaction } from '../../factions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const CalavryStalls: StructureGeneratorModel = createHireStructure({
  id: '#struct-cavalry-stalls',
  name: 'Cavalry Stalls',
  guard: {
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFaction.getUnitType('Cavalry'), 3, 3, 2],
    ],
  },
  unitsForHire: [
    { unitType: humansFaction.getUnitType('Cavalry'), maxCount: 4 },
  ]
},
);
