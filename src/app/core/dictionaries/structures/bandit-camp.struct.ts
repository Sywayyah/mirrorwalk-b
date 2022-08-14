import { ResourceType } from '../../model/resources.types';
import { ItemReward, NeutralRewardTypesEnum, ResourcesReward, StructureGeneratorModel, StuctureControl } from '../../model/structures.types';
import { CommonUtils, GenerationModel } from '../../utils/common.utils';
import { ItemDoomstring, ItemWindCrest } from '../items';
import { NEUTRAL_FRACTION_UNIT_TYPES } from '../unit-types/neutral-unit-types.dictionary';


export const BanditCamp: StructureGeneratorModel = {
    name: 'Bandit Camp',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            maxUnitGroups: 2,
            minUnitGroups: 1,
            units: [
                [NEUTRAL_FRACTION_UNIT_TYPES.Thiefs, 14, 24, 1],
                [NEUTRAL_FRACTION_UNIT_TYPES.Gnolls, 14, 24, 3],
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
                    [ItemDoomstring],
                ]
            };

            return itemReward;
        }
    },
};
