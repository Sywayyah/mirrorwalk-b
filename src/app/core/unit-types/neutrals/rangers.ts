import { neutralsFaction } from "../../factions/neutrals/faction";
import { spellDescrElem } from "../../ui";

neutralsFaction.defineUnitType({
  id: '#unit-neut-ranger-0',
  name: 'Rangers',
  level: 2,

  baseStats: {
    attackRating: 4,
    damageInfo: {
      maxDamage: 8,
      minDamage: 6,
    },
    defence: 4,
    health: 14,
    speed: 16,
  },
  defaultModifiers: {
    __attackConditionalModifiers({ attacked }) {
      if (attacked.modGroup.getModValue('isForest')) {
        return {
          baseDamagePercentModifier: 0.75,
        };
      }

      return {};
    }
  },
  defaultSpells: [],
  getDescription(params) {
    return {
      descriptions: [
        spellDescrElem(`Tier 2 Neutral unit.`),
        spellDescrElem(`Efficient against forest dwellers, dealing 75% more damage to them.`),
      ]
    }
  },

  neutralReward: {
    experience: 1,
    gold: 1,
  },
  baseRequirements: {
    gold: 100,
  },

});
