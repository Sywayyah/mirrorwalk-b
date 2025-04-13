import { constellationFaction } from '../../factions/constellation/faction';
import { heroDescrElem } from '../../ui';

// new possible constellation hero
constellationFaction.createHero({
  id: '#hero-luminous',

  name: 'Luminuous',
  abilities: [
    '#spell-rain-of-fire',
    '#spell-summon-sagittar',
    '#spell-kneeling-light'
  ],
  army: [
    {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        ['#unit-c00', 6, 11, 2],
        ['#unit-c10', 3, 5, 1],
      ],
    },
    {
      maxUnitGroups: 2,
      minUnitGroups: 2,
      units: [
        ['#unit-c00', 12, 18, 1],
        ['#unit-c10', 7, 12, 1],
      ],
    },
    {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        ['#unit-c00', 6, 10, 1],
        ['#unit-c10', 4, 6, 2],
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
