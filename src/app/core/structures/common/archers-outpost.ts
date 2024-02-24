import { humansFaction } from '../../factions';
import { StructureGeneratorModel } from '../types';
import { createHireStructure } from '../utils';

export const ArchersOutpostStructure: StructureGeneratorModel = createHireStructure({
  id: '#struct-archers-outpost',
  name: 'Archers Outpost',
  guard: {
    maxUnitGroups: 3,
    minUnitGroups: 3,
    units: [
      [humansFaction.getUnitType('Archer'), 8, 11, 3],
    ],
  },
  unitsForHire: [
    { unitType: humansFaction.getUnitType('Archer'), maxCount: 12 },
  ]
},
);
