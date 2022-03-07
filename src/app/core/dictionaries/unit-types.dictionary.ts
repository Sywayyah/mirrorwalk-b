import { UnitTypeModel } from "../model/main.model";


export enum HF_TYPES_ENUM {
    Pikemans = 'Pikemans',
    Archers = 'Archers',

}

export const HUMANS_FRACTION_UNIT_TYPES: Record<HF_TYPES_ENUM, UnitTypeModel> = {
    
    [HF_TYPES_ENUM.Pikemans]: {    
        mainPortraitUrl: '',
        name: 'Pikemans',

        damageInfo: {
            maxDamage: 4,
            minDamage: 2,
        },
        defence: 4,
        health: 12,
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
            maxDamage: 2,
            minDamage: 1,
        },
        defence: 1,
        health: 5,
        minQuantityPerStack: 12,
        speed: 21,
        defaultTurnsPerRound: 2,

        baseRequirements: {},
    },
};