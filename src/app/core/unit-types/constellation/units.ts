import { AssetsImages } from '../../assets';
import { constellationFraction } from '../../fractions/constellation/fraction';
import { spellDescrElem } from '../../ui';
import { EssenceLeak } from './spells/essence-leak';

// Units of constellation might be more durable and slightly higher
// quality then average units

constellationFraction.defineUnitType('Sprite', {
  id: '#ut-c00',
  name: 'Sprite',
  level: 1,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 75,
  },

  getDescription: () => {
    return {
      descriptions: [
        spellDescrElem('Tier 1 units of the Constellation.'),
        spellDescrElem('<br>One of the strongest tier 1 unit types due to high-value abilities. Sprites can curse specific enemy to heal allied attackers.'),
      ],
    };
  },

  defaultSpells: [EssenceLeak],

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 3,
    },
    speed: 8,
    defence: 4,
    health: 14,
    attackRating: 4,
  },

  neutralReward: {
    experience: 12,
    gold: 8,
  },
});

// block/retaliation mechanics
constellationFraction.defineUnitType('Fencer', {
  id: '#ut-c10',

  name: 'Fencer',
  level: 2,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 75,
  },

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 4,
    },
    speed: 7,
    defence: 2,
    health: 13,
    attackRating: 5,
  },

  neutralReward: {
    experience: 12,
    gold: 8,
  },
});

constellationFraction.defineUnitType('Sagittar', {
  id: '#ut-c20',

  name: 'Saggitar',
  level: 3,
  mainPortraitUrl: AssetsImages.UnitRanged,

  baseRequirements: {
    gold: 95,
  },

  defaultModifiers: {
    isRanged: true,
  },

  baseStats: {
    damageInfo: {
      minDamage: 6,
      maxDamage: 8,
    },
    speed: 17,
    defence: 4,
    health: 17,
    attackRating: 5,
  },

  neutralReward: {
    experience: 18,
    gold: 14,
  },
})

// potential level 5
constellationFraction.defineUnitType('Chariot', {
  id: '#ut-c30',

  name: 'Chariot',
  level: 4,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 185,
  },

  baseStats: {
    damageInfo: {
      minDamage: 15,
      maxDamage: 24,
    },
    speed: 24,
    defence: 8,
    health: 35,
    attackRating: 9,
  },

  neutralReward: {
    experience: 18,
    gold: 14,
  },
});

/* Star Dragon/Night Wyvern, potential level 7 unit type for Constellation */
// Main feature: Dream Aura
// Dream Aura: Some events around Night Wyverns become a part of their dream.
//  Gives +10%/+15% to All Resists to units around. May also provide armor with aura.

constellationFraction.defineUnitType('NightWyvern', {
  id: '#ut-c61',

  name: 'Night Wyvern',
  level: 7,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 1500,
    gems: 2,
    redCrystals: 1,
  },

  baseStats: {
    damageInfo: {
      minDamage: 47,
      maxDamage: 64,
    },
    speed: 22,
    defence: 21,
    health: 245,
    attackRating: 17,
  },

  neutralReward: {
    experience: 180,
    gold: 150,
  },
  upgraded: true,
})

constellationFraction.defineUnitType('StarDragon', {
  id: '#ut-c60',

  name: 'Star Dragon',
  level: 7,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 1000,
    gems: 1,
    redCrystals: 1,
  },

  upgradeDetails: {
    target: constellationFraction.getUnitType('NightWyvern'),
    // targetId: '#ut-c61',
    upgradeCost: {
      gold: 500,
      gems: 1,
    },
  },

  baseStats: {
    damageInfo: {
      minDamage: 40,
      maxDamage: 60,
    },
    speed: 20,
    defence: 18,
    health: 175,
    attackRating: 16,
  },

  neutralReward: {
    experience: 180,
    gold: 150,
  },
});
