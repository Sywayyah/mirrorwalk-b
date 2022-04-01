import { UnitTypeModel } from "../model/main.model";

export enum NEUTRAL_TYPES_ENUM {
    Gnolls = 'Gnolls',
    Thiefs = 'Thiefs',
    ForestTrolls = 'ForestTrolls',
}

export const NEUTRAL_FRACTION_UNIT_TYPES: Record<NEUTRAL_TYPES_ENUM, UnitTypeModel> = {
    
    [NEUTRAL_TYPES_ENUM.Gnolls]: {    
        mainPortraitUrl: '',
        name: 'Gnolls',

        damageInfo: {
            maxDamage: 2,
            minDamage: 4,
        },
        defence: 1,
        health: 10,
        speed: 12,
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

        damageInfo: {
            maxDamage: 7,
            minDamage: 3,
        },
        defence: 1,
        health: 15,
        minQuantityPerStack: 4,
        speed: 17,
        defaultTurnsPerRound: 2,

        baseRequirements: {},
    },
    [NEUTRAL_TYPES_ENUM.ForestTrolls]: {
        mainPortraitUrl: '',
        name: 'Forest Trolls',

        damageInfo: {
            maxDamage: 12,
            minDamage: 7,
        },
        defence: 4,
        health: 28,
        minQuantityPerStack: 2,
        speed: 10,
        defaultTurnsPerRound: 1,

        baseRequirements: {},
    },
};