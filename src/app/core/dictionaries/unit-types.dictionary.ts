import { AbilityTypesEnum } from "../model/abilities.types";
import { UnitTypeModel } from "../model/main.model";
import { Abilities } from "./abilities.const";


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
            playerGold: 100,
            playerBloodCrystals: 0,
            playerGloryLevel: 1,
            playerHeroLevel: 1,
        }
    },

    [HF_TYPES_ENUM.Archers]: {
        mainPortraitUrl: '',
        name: 'Archers',
        level: 2,

        baseStats: {
            damageInfo: {
                minDamage: 4,
                maxDamage: 5,
            },
            attackRating: 2,
            defence: 2,
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
    },
    [HF_TYPES_ENUM.Cavalry]: {
        name: 'Cavalry',
        baseRequirements: {},
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
        mainPortraitUrl: ''
    }
};

