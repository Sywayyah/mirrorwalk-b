import { UnitTypeModel } from "../model/main.model";


export enum HF_TYPES_ENUM {
    Pikemans = 'Pikemans',
    Archers = 'Archers',
    Knights = 'Knights',
    Cavalry = 'Cavalry',
}

export const HUMANS_FRACTION_UNIT_TYPES: Record<HF_TYPES_ENUM, UnitTypeModel> = {
    
    [HF_TYPES_ENUM.Pikemans]: {    
        mainPortraitUrl: '',
        name: 'Pikemans',

        damageInfo: {
            maxDamage: 4,
            minDamage: 2,
        },
        defence: 1,
        health: 11,
        speed: 13,
        minQuantityPerStack: 5,
        defaultTurnsPerRound: 1,

        baseRequirements: {
            playerGold: 100,
            playerBloodCrystals: 0,
            playerGloryLevel: 1,
            playerHeroLevel: 1,
        }
    },

    [HF_TYPES_ENUM.Archers]: {
        mainPortraitUrl: '',
        name: 'Archers',

        damageInfo: {
            maxDamage: 4,
            minDamage: 2,
        },
        defence: 1,
        health: 14,
        minQuantityPerStack: 12,
        speed: 21,
        defaultTurnsPerRound: 2,

        baseRequirements: {},
    },
    [HF_TYPES_ENUM.Knights]: {
        mainPortraitUrl: '',
        name: 'Knights',

        damageInfo: {
            maxDamage: 11,
            minDamage: 7,
        },
        defence: 4,
        health: 31,
        minQuantityPerStack: 2,
        speed: 6,
        defaultTurnsPerRound: 1,

        baseRequirements: {},
    },
    [HF_TYPES_ENUM.Cavalry]: {
        name: 'Cavalry',
        baseRequirements: {},
        damageInfo: {
            maxDamage: 24,
            minDamage: 15,
        },
        defaultTurnsPerRound: 1,
        defence: 4,
        health: 46,
        minQuantityPerStack: 1,
        speed: 12,
        mainPortraitUrl: ''
    }
};

