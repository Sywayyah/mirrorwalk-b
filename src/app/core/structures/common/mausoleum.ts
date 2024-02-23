import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { GenerationModel } from '../../unit-types';
import { StructureGeneratorModel, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const Mausoleum: StructureGeneratorModel = createStructure({
  id: '#struct-mausoleum',

  name: 'Mausoleum',
  actionPoints: 1,
  control: StuctureControl.Neutral,

  generateGuard: () => {
    const guard = {
      minUnitGroups: 3,
      maxUnitGroups: 3,
      units: [
        [neutralsFraction.getUnitType('Skeletons'), 22, 34, 2],
        [neutralsFraction.getUnitType('Lich'), 3, 4, 1],
      ],
    } as GenerationModel;

    return guard;
  },
});
