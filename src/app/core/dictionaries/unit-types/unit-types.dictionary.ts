import { UnitTypeModel } from "../../model/main.model";
import { AssetsImages } from "../images.const";

export enum HF_TYPES_ENUM {
    Pikemans = 'Pikemans',
    Archers = 'Archers',
    Knights = 'Knights',
    Cavalry = 'Cavalry',
}

const defaultRewards = {
    experience: 0,
    gold: 0,
}

export const HUMANS_FRACTION_UNIT_TYPES: Record<HF_TYPES_ENUM, UnitTypeModel> = {

    [HF_TYPES_ENUM.Pikemans]: {
        mainPortraitUrl: AssetsImages.Melee,
        name: 'Pikemans',
        level: 1,

        baseStats: {
            damageInfo: {
                minDamage: 3,
                maxDamage: 3,
            },
            attackRating: 2,
            defence: 2,
            health: 6,
            speed: 13,
        },
        minQuantityPerStack: 5,
        defaultTurnsPerRound: 1,

        baseRequirements: {
            gold: 60,
            redCrystals: 0,
        },
        neutralReward: defaultRewards,
    },

    [HF_TYPES_ENUM.Archers]: {
        mainPortraitUrl: AssetsImages.Ranged,
        name: 'Archers',
        level: 2,

        baseStats: {
            damageInfo: {
                minDamage: 3,
                maxDamage: 4,
            },
            attackRating: 3,
            defence: 3,
            health: 8,
            speed: 21,
        },

        defaultModifiers: {
            isRanged: true,
        },

        minQuantityPerStack: 12,
        defaultTurnsPerRound: 2,

        baseRequirements: {
            gold: 95,
        },
        neutralReward: defaultRewards,
    },
    [HF_TYPES_ENUM.Knights]: {
        mainPortraitUrl: AssetsImages.Melee,
        name: 'Knights',
        level: 3,

        baseStats: {
            damageInfo: {
                minDamage: 6,
                maxDamage: 9,
            },
            attackRating: 6,
            defence: 5,
            health: 17,
            speed: 10,
        },
        minQuantityPerStack: 2,
        defaultTurnsPerRound: 1,

        baseRequirements: {},
        neutralReward: defaultRewards,
    },
    [HF_TYPES_ENUM.Cavalry]: {
        name: 'Cavalry',
        mainPortraitUrl: AssetsImages.Melee,

        
        level: 4,

        baseStats: {
            damageInfo: {
                minDamage: 12,
                maxDamage: 15,
            },
            attackRating: 9,
            defence: 8,
            health: 31,
            speed: 12,
        },

        defaultTurnsPerRound: 1,
        minQuantityPerStack: 1,
        
        baseRequirements: {
            gold: 175,
            wood: 1,
            redCrystals: 1
        },
        neutralReward: defaultRewards,
    }
};

