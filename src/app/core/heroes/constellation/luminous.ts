import { constellationFaction } from '../../factions/constellation/faction';
import { WishmasterItem } from '../../items/neutral';
import { KneelingLight, RainOfFireSpell } from '../../spells/common';
import { SummonSagittarSpell } from '../../spells/common/summon-sagittar';
import { heroDescrElem } from '../../ui';

// new possible constellation hero
constellationFaction.createHero({
  id: '#hero-luminous',

  name: 'Luminuous',
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
        [constellationFaction.getUnitType('Sprite'), 6, 11, 2],
        [constellationFaction.getUnitType('Sagittar'), 3, 5, 1],
      ],
    },
    {
      maxUnitGroups: 2,
      minUnitGroups: 2,
      units: [
        [constellationFaction.getUnitType('Sprite'), 12, 18, 1],
        [constellationFaction.getUnitType('Sagittar'), 7, 12, 1],
      ],
    },
    {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [constellationFaction.getUnitType('Sprite'), 6, 10, 1],
        [constellationFaction.getUnitType('Sagittar'), 4, 6, 2],
      ],
    }
  ],
  generalDescription: heroDescrElem(`Blackbird is a hero who specializes at Astral and Fire magic, as well as Summoning.`),
  items: [
    // ItemWindCrest,
    // WishmasterItem,
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
