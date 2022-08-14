import { HeroModel as HeroModelBase, HeroModelStats } from "../model/hero.model";
import { ResourcesModel } from "../model/resources.types";
import { ItemWindCrest } from "./items";
import { METEOR_SPELL, RAIN_OF_FIRE_SPELL } from "./spells";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "./unit-types/unit-types.dictionary";

const heroesDefaultResources: ResourcesModel = {
    gems: 0,
    gold: 1250,
    redCrystals: 0,
    wood: 0,
};

export const EMPTY_RESOURCES: ResourcesModel = {
    gems: 0,
    gold: 0,
    redCrystals: 0,
    wood: 0,
};

export const createHeroModelBase: (heroConfig: Pick<HeroModelBase, 'name'> & HeroModelStats) => HeroModelBase = (
    heroConfig,
) => {
    const {
        abilities,
        army,
        items,
        name,
        resources,
        stats,
    } = heroConfig;

    return {
        name,
        initialState: {
            abilities,
            army,
            items,
            resources,
            stats,
        },
    };
};

export const HelveticaHero: HeroModelBase = createHeroModelBase({
    name: 'Helvetica',
    abilities: [
        // ENCHANT_SPELL,
        RAIN_OF_FIRE_SPELL,
    ],
    army: [{
        fraction: HUMANS_FRACTION_UNIT_TYPES,
        maxUnitGroups: 2,
        minUnitGroups: 2,
        units: [
            [HF_TYPES_ENUM.Archers, 12, 18, 1],
            [HF_TYPES_ENUM.Knights, 6, 11, 1],
            [HF_TYPES_ENUM.Pikemans, 20, 32, 1],
        ],
    }],
    items: [ItemWindCrest],
    resources: {
        ...heroesDefaultResources,
        wood: 4,
    },
    stats: {
        mana: 15,
        baseAttack: 1,
    },
});

export const TaltirHero: HeroModelBase = createHeroModelBase({
    name: 'Taltir',
    abilities: [
        METEOR_SPELL,
    ],
    army: [{
        fraction: HUMANS_FRACTION_UNIT_TYPES,
        maxUnitGroups: 2,
        minUnitGroups: 2,
        units: [
            [HF_TYPES_ENUM.Knights, 6, 11, 2],
            [HF_TYPES_ENUM.Cavalry, 3, 6, 2],
            [HF_TYPES_ENUM.Pikemans, 25, 30, 1],
        ],
    }],
    items: [ItemWindCrest],
    resources: heroesDefaultResources,
    stats: {
        mana: 14,
        baseAttack: 2,
    },
});