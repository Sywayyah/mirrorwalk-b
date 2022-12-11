import { Resources } from '../resources';

type CastleTownBuildings = 'town-center'
  | 'market'
  | 'magic-school'
  | 'fate-halls'
  | 'tavern'
  | 'training-camp'
  | 'archers-outpost'
  | 'halls-of-knights'
  | 'cavalry-halls'
  | 'magic-tower';

export interface Building {
  name: string;
  cost: Resources;
  upgrade?: Building;
}

export interface TownBase<T extends string> {
  name: string;
  availableBuildings: Record<T, { building: Building }>;
}

const townCenter = {
  name: 'Town Center',
  cost: { gold: 100 }
};

const market = {
  name: 'Market',
  cost: { gold: 100 },
};

const magicScool: Building = {
  name: 'Magic School',
  cost: { gold: 200, redCrystals: 1 },
};

const tavern = {
  name: 'Tavern',
  cost: { gold: 100, wood: 2 },
};

const trainingCamp = {
  name: 'Training Camp',
  cost: { gold: 500 },
};

const archersOutpost = {
  name: 'Archers Outpost',
  cost: { gold: 750, wood: 1 },
};

const hallsOfKnights = {
  name: 'Archers Outpost',
  cost: { gold: 1000, wood: 4 },
};

const cavalryStalls = {
  name: 'Cavalry Stalls',
  cost: { gold: 1500, wood: 6 },
};

const magicTower: Building = {
  name: 'Magic Tower',
  cost: { gold: 1500, redCrystals: 2 },
};

const castleTownBase: TownBase<CastleTownBuildings> = {
  name: 'Castle',
  availableBuildings: {
    'town-center': { building: townCenter },
    'market': { building: market },
    "magic-school": { building: magicScool },
    'tavern': { building: tavern },
    'fate-halls': { building: { name: 'Halls of Fate', cost: { gold: 100 } } },
    'training-camp': { building: trainingCamp },
    'archers-outpost': { building: archersOutpost },
    'halls-of-knights': { building: hallsOfKnights },
    'cavalry-halls': { building: cavalryStalls },
    'magic-tower': { building: magicTower },
  },
};

const castleTown = {
  base: castleTownBase,
  buildings: [],
};
