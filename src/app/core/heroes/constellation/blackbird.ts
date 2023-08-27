import { AssetsImages } from '../../assets';
import { constellationFraction } from '../../fractions/constellation/fraction';
import { WishmasterItem } from '../../items/neutral';
import { KneelingLight, RainOfFireSpell } from '../../spells/common';
import { SummonSagittarSpell } from '../../spells/common/summon-sagittar';
import { heroDescrElem } from '../../ui';

// possible constellation skill:
//  Summon Star Dragon.
constellationFraction.createHero({
  name: 'Blackbird',
  image: AssetsImages.HeroMelee,
  abilities: [
    RainOfFireSpell,
    SummonSagittarSpell,
    KneelingLight,
  ],
  army: [
    {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [constellationFraction.getUnitType('Sprite'), 6, 11, 2],
        [constellationFraction.getUnitType('Sagittar'), 3, 5, 1],
      ],
    },
    {
      maxUnitGroups: 2,
      minUnitGroups: 2,
      units: [
        [constellationFraction.getUnitType('Sprite'), 12, 18, 1],
        [constellationFraction.getUnitType('Sagittar'), 7, 12, 1],
      ],
    },
    {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [constellationFraction.getUnitType('Sprite'), 6, 10, 1],
        [constellationFraction.getUnitType('Sagittar'), 4, 6, 2],
      ],
    }
  ],
  generalDescription: heroDescrElem(`Blackbird is a hero who specializes at Astral and Fire magic, as well as Summoning.`),
  items: [
    // ItemWindCrest,
    WishmasterItem,
  ],
  stats: {
    baseAttack: 2,
    baseDefence: 4,
    mana: 15,
  },
  resources: {
    gems: 1,
    gold: 1000,
    redCrystals: 1,
    wood: 1,
  },
})
