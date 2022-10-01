import { HeroModel as HeroModelBase, HeroModelStats } from "../model/hero.model";
import { ResourcesModel } from "../model/resources.types";
import { ItemWindCrest } from "./items";
import { MeteorSpell, PoisonCloudSpell, RainOfFireSpell } from "./spells";
import { HasteSpell } from "./spells/haste.spell";
import { HealSpell } from "./spells/heal.spell";
import { HUMANS_FRACTION_UNIT_TYPES } from "./unit-types/unit-types.dictionary";

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
    RainOfFireSpell,
    // KneelingLight,
    HasteSpell,
    // HealSpell,
    // PoisonCloudSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [HUMANS_FRACTION_UNIT_TYPES.Archers, 12, 18, 1],
      [HUMANS_FRACTION_UNIT_TYPES.Knights, 6, 11, 1],
      [HUMANS_FRACTION_UNIT_TYPES.Pikemans, 20, 32, 1],
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
    MeteorSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [HUMANS_FRACTION_UNIT_TYPES.Knights, 6, 11, 2],
      [HUMANS_FRACTION_UNIT_TYPES.Cavalry, 3, 6, 2],
      [HUMANS_FRACTION_UNIT_TYPES.Pikemans, 25, 30, 1],
    ],
  }],
  items: [ItemWindCrest],
  resources: heroesDefaultResources,
  stats: {
    mana: 14,
    baseAttack: 2,
  },
});
