import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { ItemEclipseWand, ItemIceBow, ItemMeteorSwords, ItemWindCrest } from '../../items/neutral';
import { ResourceType } from '../../resources';
import { CommonUtils, GenerationModel } from '../../unit-types';
import { ItemReward, NeutralRewardTypesEnum, ResourcesReward, StructureGeneratorModel, StuctureControl } from '../types';


export const BanditCamp: StructureGeneratorModel = {
  name: 'Bandit Camp',
  control: StuctureControl.Neutral,

  generateGuard: () => {
    const guard = {
      maxUnitGroups: 2,
      minUnitGroups: 1,
      units: [
        [neutralsFraction.getUnitType('Thiefs'), 14, 24, 1],
        [neutralsFraction.getUnitType('Gnoll'), 14, 24, 3],
      ],
    } as GenerationModel;

    return guard;
  },

  generateReward: () => {
    if (CommonUtils.randBoolean()) {
      const resourcesReward: ResourcesReward = {
        type: NeutralRewardTypesEnum.Resources,
        resourceGroups: [
          [
            { type: ResourceType.Gold, count: 450, },
            { type: ResourceType.Gems, count: 1, },
          ],
          [
            { type: ResourceType.Gold, count: 800, },
            { type: ResourceType.Wood, count: 2, },
          ],
        ],
      };

      return resourcesReward;
    } else {
      const itemReward: ItemReward = {
        type: NeutralRewardTypesEnum.Item,
        itemGroups: [
          [ItemWindCrest],
          [ItemEclipseWand],
          [ItemMeteorSwords],
          [ItemIceBow],
        ]
      };

      return itemReward;
    }
  },
};
