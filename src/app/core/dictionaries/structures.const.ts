import { ResourceType } from "../model/resources.types";
import { HiringReward, ItemReward, NeutralRewardTypesEnum, ResourcesReward, StructureGeneratorModel, StuctureControl } from "../model/structures.types";
import { CommonUtils, GenerationModel, RandomUtils } from "../utils/common.utils";
import { ItemDoomstring, ItemWindCrest } from "./items.dictionary";
import { NEUTRAL_FRACTION_UNIT_TYPES, NEUTRAL_TYPES_ENUM } from "./unit-types/neutral-unit-types.dictionary";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "./unit-types/unit-types.dictionary";


export const GraveyardStructure: StructureGeneratorModel = {
    name: 'Graveyard',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            fraction: NEUTRAL_FRACTION_UNIT_TYPES,
            maxUnitGroups: 3,
            minUnitGroups: 1,
            units: [
                [NEUTRAL_TYPES_ENUM.Ghosts, 14, 24, 3],
            ],
        } as GenerationModel;

        return guard;
    },

    generateReward: () => {
        const hiringReward: HiringReward = {
            type: NeutralRewardTypesEnum.UnitsHire,
            units: [
                { unitType: NEUTRAL_FRACTION_UNIT_TYPES.Ghosts, maxCount: 24 },
            ],
        };

        return hiringReward;
    },
};

export const BanditCamp: StructureGeneratorModel = {
    name: 'Bandit Camp',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            fraction: NEUTRAL_FRACTION_UNIT_TYPES,
            maxUnitGroups: 2,
            minUnitGroups: 1,
            units: [
                [NEUTRAL_TYPES_ENUM.Thiefs, 14, 24, 1],
                [NEUTRAL_TYPES_ENUM.Gnolls, 14, 24, 3],
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
                        { type: ResourceType.RedCrystals, count: 1, },
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
                    [ ItemWindCrest ],
                    [ ItemDoomstring ],
                ]
            };

            return itemReward;
        }


    },
};

export const ArchersOutpostStructure: StructureGeneratorModel = {
    name: 'Archers Outpost',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            fraction: HUMANS_FRACTION_UNIT_TYPES,
            maxUnitGroups: 2,
            minUnitGroups: 1,
            units: [
                [HF_TYPES_ENUM.Archers, 12, 22, 2],
            ],
        } as GenerationModel;

        return guard;
    },

    generateReward: () => {
        const hiringReward: HiringReward = {
            type: NeutralRewardTypesEnum.UnitsHire,
            units: [
                { unitType: HUMANS_FRACTION_UNIT_TYPES.Archers, maxCount: 12 },
            ],
        };

        return hiringReward;
    },
};

export const CalavryStalls: StructureGeneratorModel = {
    name: 'Cavalry Stalls',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            fraction: HUMANS_FRACTION_UNIT_TYPES,
            maxUnitGroups: 1,
            minUnitGroups: 1,
            units: [
                [HF_TYPES_ENUM.Cavalry, 4, 7, 1],
            ],
        } as GenerationModel;

        return guard;
    },

    generateReward: () => {
        const hiringReward: HiringReward = {
            type: NeutralRewardTypesEnum.UnitsHire,
            units: [
                { unitType: HUMANS_FRACTION_UNIT_TYPES.Cavalry, maxCount: 3 },
            ],
        };

        return hiringReward;
    },
};