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
                maxDamage: 4,
                minDamage: 2,
            },
            defence: 1,
            health: 11,
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
                maxDamage: 4,
                minDamage: 2,
            },
            defence: 1,
            health: 14,
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
            defence: 4,
            health: 31,
            speed: 6,    
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
                maxDamage: 24,
                minDamage: 15,
            },
            health: 46,
            defence: 4,
            speed: 12,    
        },
        
        defaultTurnsPerRound: 1,
        minQuantityPerStack: 1,
        mainPortraitUrl: ''
    }
};

