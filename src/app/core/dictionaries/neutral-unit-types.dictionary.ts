import { UnitTypeModel } from "../model/main.model";

export enum NEUTRAL_TYPES_ENUM {
    Gnolls = 'Gnolls',
    Thiefs = 'Thiefs',
    ForestTrolls = 'ForestTrolls',
    Ghosts = 'Ghosts',
}

export const NEUTRAL_FRACTION_UNIT_TYPES: Record<NEUTRAL_TYPES_ENUM, UnitTypeModel> = {

    [NEUTRAL_TYPES_ENUM.Ghosts]: {
        mainPortraitUrl: '',
        name: 'Ghosts',
        baseRequirements: {},
        baseStats: {
            damageInfo: {
                minDamage: 2,
                maxDamage: 3,
            },
            attackRating: 1,
            defence: 1,
            health: 7,
            speed: 8,
        },
        defaultTurnsPerRound: 1,
        minQuantityPerStack: 1,
    },
    [NEUTRAL_TYPES_ENUM.Gnolls]: {
        mainPortraitUrl: '',
        name: 'Gnolls',

        baseStats: {
            damageInfo: {
                maxDamage: 2,
                minDamage: 4,
            },
            attackRating: 1,
            defence: 1,
            health: 10,
            speed: 12,
        },
        minQuantityPerStack: 5,
        defaultTurnsPerRound: 1,

        baseRequirements: {
            playerGold: 100,
            playerBloodCrystals: 0,
            playerGloryLevel: 1,
            playerHeroLevel: 1,
        }
    },
    [NEUTRAL_TYPES_ENUM.Thiefs]: {
        mainPortraitUrl: '',
        name: 'Thiefs',
        baseStats: {
            damageInfo: {
                maxDamage: 7,
                minDamage: 3,
            },
            attackRating: 2,
            defence: 1,
            health: 15,
            speed: 17,
        },

        minQuantityPerStack: 4,
        defaultTurnsPerRound: 2,

        baseRequirements: {},
    },
    [NEUTRAL_TYPES_ENUM.ForestTrolls]: {
        mainPortraitUrl: '',
        name: 'Forest Trolls',

        baseStats: {
            damageInfo: {
                maxDamage: 12,
                minDamage: 7,
            },
            attackRating: 3,
            defence: 4,
            health: 28,
            speed: 10,
        },

        minQuantityPerStack: 2,
        defaultTurnsPerRound: 1,

        baseRequirements: {},
    },
};