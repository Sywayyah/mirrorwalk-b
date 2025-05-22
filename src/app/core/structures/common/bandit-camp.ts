import { isFeatureEnabled } from '../../config';
import { Feature } from '../../config/types';
import { ItemEclipseWand, ItemIceBow, ItemMeteorSwords, ItemWindCrest } from '../../items/neutral';
import { LightBootsItem } from '../../items/neutral/light-boots';
import { ResourceType } from '../../resources';
import { ArmyGenerationModel } from '../../unit-types';
import { CommonUtils } from '../../utils';
import {
  ItemReward,
  NeutralRewardTypesEnum,
  ResourcesReward,
  StructureGeneratorModel,
  StuctureControl,
} from '../types';
import { createStructure } from '../utils';

export const BanditCamp: StructureGeneratorModel = createStructure({
  id: '#struct-bandit-camp',
  name: 'Bandit Camp',
  actionPoints: 1,
  control: StuctureControl.Neutral,

  generateGuard: () => {
    const banditGuards = {
      maxUnitGroups: 2,
      minUnitGroups: 1,
      units: [
        ['#unit-neut-thief-0', 14, 24, 1],
        ['#unit-neut-gnoll-0', 14, 24, 3],
      ],
    } as ArmyGenerationModel;

    const windElementals: ArmyGenerationModel = {
      maxUnitGroups: 2,
      minUnitGroups: 2,
      units: [['#unit-neut-wind-spirit-0', 5, 8, 2]],
    };

    const fireBirds: ArmyGenerationModel = {
      maxUnitGroups: 1,
      minUnitGroups: 1,
      units: [['#unit-h40', 3, 4, 1]],
    };

    return isFeatureEnabled(Feature.TECHBanditCampVariety)
      ? CommonUtils.randItem([windElementals, banditGuards, fireBirds])
      : banditGuards;
  },

  generateReward: () => {
    if (CommonUtils.randBoolean()) {
      const resourcesReward: ResourcesReward = {
        type: NeutralRewardTypesEnum.Resources,
        resourceGroups: [
          [
            { type: ResourceType.Gold, count: 450 },
            { type: ResourceType.Gems, count: 1 },
          ],
          [
            { type: ResourceType.Gold, count: 800 },
            { type: ResourceType.Wood, count: 2 },
          ],
        ],
      };

      return resourcesReward;
    } else {
      const itemReward: ItemReward = {
        type: NeutralRewardTypesEnum.Item,
        itemGroups: [
          [CommonUtils.randBoolean() ? ItemWindCrest : LightBootsItem],
          [ItemEclipseWand],
          [ItemMeteorSwords],
          [ItemIceBow],
        ],
      };

      return itemReward;
    }
  },
});
