import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { BlackLichSwordItem } from '../../items/neutral/black-lich-sword';
import { IrtonPlateItem } from '../../items/neutral/irton-plate';
import { PhoenixShieldItem } from '../../items/neutral/phoenix-shield';
import { GenerationModel } from '../../unit-types';
import { ItemReward, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from '../types';

export const ThievesLair: StructureGeneratorModel = {
  name: 'Thieves\' Lair',
  actionPoints: 2,
  control: StuctureControl.Neutral,

  generateGuard: () => {
    const guard = {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [neutralsFraction.getUnitType('Thieves'), 12, 14, 2],
        [neutralsFraction.getUnitType('Gnoll'), 14, 24, 3],
      ],
    } as GenerationModel;

    return guard;
  },

  generateReward: () => {
    const itemReward: ItemReward = {
      type: NeutralRewardTypesEnum.Item,
      itemGroups: [
        [IrtonPlateItem],
        [BlackLichSwordItem],
        [PhoenixShieldItem],
      ]
    };

    return itemReward;
  },
};
