import { neutralsFaction } from '../../factions/neutrals/faction';
import { spellDescrElem } from '../../ui';


neutralsFaction.defineUnitType({
  id: '#unit-neut-imperial-guard',
  name: 'Imperial Guard',
  level: 3,

  neutralReward: {
    experience: 10,
    gold: 0,
  },

  baseStats: {
    attackRating: 3,
    defence: 3,
    damageInfo: {
      maxDamage: 3,
      minDamage: 3,
    },
    health: 14,
    speed: 12,
  },
  defaultModifiers: {
    retaliationDamagePercent: 0.5,
    counterattacks: true,
  },

  defaultSpells: [
    '#spell-tower-shields-block'
  ],

  getDescription: () => {
    return {
      descriptions: [
        spellDescrElem('Imperial Guards, a part of the imperial army, well trained with combat tactics. They can block damage and retaliate.'),
      ]
    }
  },
  baseRequirements: {},
});
