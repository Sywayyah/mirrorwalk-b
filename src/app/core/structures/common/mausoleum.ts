import { ArmyGenerationModel } from '../../unit-types';
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
        ['#unit-neut-skeleton-0', 22, 34, 2],
        ['#unit-neut-lich-0', 3, 4, 1],
      ],
    } as ArmyGenerationModel;

    return guard;
  },
});
