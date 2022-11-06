import { HeroModel as HeroModelBase } from "../../model/hero.model";
import { ItemWindCrest } from "../items";
import { RainOfFireSpell } from "../spells";
import { HasteSpell } from "../spells/haste.spell";
import { HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/humans.units";
import { createHeroModelBase, heroesDefaultResources } from "./utils";


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
