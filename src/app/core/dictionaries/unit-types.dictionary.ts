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

        baseStats: {
            damageInfo: {
                maxDamage: 5,
                minDamage: 2,
            },
            attackRating: 1,
            defence: 1,
            health: 6,
            speed: 13,
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

    [HF_TYPES_ENUM.Archers]: {
        mainPortraitUrl: '',
        name: 'Archers',

        baseStats: {
            damageInfo: {
                minDamage: 4,
                maxDamage: 6,
            },
            attackRating: 2,
            defence: 1,
            health: 7,
            speed: 21,
        },
        minQuantityPerStack: 12,
        defaultTurnsPerRound: 2,

        baseRequirements: {},
    },
    [HF_TYPES_ENUM.Knights]: {
        mainPortraitUrl: '',
        name: 'Knights',

        baseStats: {
            damageInfo: {
                maxDamage: 11,
                minDamage: 7,
            },
            attackRating: 4,
            defence: 4,
            health: 17,
            speed: 10,    
        },
        minQuantityPerStack: 2,
        defaultTurnsPerRound: 1,

        baseRequirements: {},
    },
    [HF_TYPES_ENUM.Cavalry]: {
        name: 'Cavalry',
        baseRequirements: {},

        baseStats: {
            damageInfo: {
                maxDamage: 17,
                minDamage: 13,
            },
            attackRating: 5,
            health: 31,
            defence: 4,
            speed: 12,    
        },
        
        defaultTurnsPerRound: 1,
        minQuantityPerStack: 1,
        mainPortraitUrl: ''
    }
};

