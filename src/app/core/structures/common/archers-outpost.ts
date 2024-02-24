import { humansFraction } from '../../factions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const ArchersOutpostStructure: StructureGeneratorModel = createHireStructure({
  id: '#struct-archers-outpost',
  name: 'Archers Outpost',
  guard: {
    maxUnitGroups: 3,
    minUnitGroups: 3,
    units: [
      [humansFraction.getUnitType('Archer'), 8, 11, 3],
    ],
  },
  unitsForHire: [
    { unitType: humansFraction.getUnitType('Archer'), maxCount: 12 },
  ]
},
);
