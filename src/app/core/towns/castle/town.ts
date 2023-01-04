import { humansFraction, HUMANS_UNIT_TYPES } from '../../fractions';
import { ActivityTypes, BuidlingBase, HiringActivity, TownBase } from '../types';


function createHiringActivity(
  unitType: HUMANS_UNIT_TYPES,
  growth: number,
  unitGrowthGroup: string,
  upgrade: boolean = false,
): HiringActivity {
  return {
    type: ActivityTypes.Hiring,
    hiring: { type: humansFraction.getUnitType(unitType), growth, refillDaysInterval: 7 },
    unitGrowthGroup,
    growth,
    growthIntervalDays: 7,
    upgrade,
  } as HiringActivity;
}

export type CastleTownBuildings = 'town-center'
  | 'market'
  | 'magic-school'
  | 'fate-halls'
  | 'tavern'
  | 'training-camp'
  | 'archers-outpost'
  | 'halls-of-knights'
  | 'cavalry-halls'
  | 'magic-tower';


const townCenter: BuidlingBase = {
  name: 'Town Center',
};

const market: BuidlingBase = {
  name: 'Market',
};

const magicScool: BuidlingBase = {
  name: 'Magic School',
};

const tavern: BuidlingBase = {
  name: 'Tavern',
};

/*
  Buildings might be reworked

  levels, costs and labels per level might move under activities

  there will be no possibility to change building type,
  but it's unlikely that it will need to be changed.

  also, additional details for activity appear for activity

  and also buildings are going to be processed in some way
  at the moment of creation. For example, units growth map
  is going to be created from buildings with hiring activity
  type
*/
const trainingCamp: BuidlingBase = {
  name: 'Training Camp',
  activity: createHiringActivity('Pikeman', 12, 'pikeman'),
};

const upgradedTrainingCamp: BuidlingBase = {
  name: 'Upg. Training Camp',
  description: 'Allows to hire and upgrade Halberdiers',
  activity: createHiringActivity('Pikeman', 12, 'pikeman', true),
};

const archersOutpost = {
  name: 'Archers Outpost',
  activity: createHiringActivity('Archer', 10, 'archers'),
};

const hallsOfKnights = {
  name: 'Halls of Knights',
  activity: createHiringActivity('Knight', 7, 'knights'),
};

const cavalryStalls = {
  name: 'Cavalry Stalls',
  activity: createHiringActivity('Cavalry', 3, 'cavalry'),
};

const magicTower: BuidlingBase = {
  name: 'Magic Tower',
  activity: createHiringActivity('Firebird', 1, 'firebirds'),
};

// will be reworked, need somehow to process it in the fraction itself
export const castleTownBase: TownBase<CastleTownBuildings> = {
  name: 'Castle',
  availableBuildings: {
    'town-center': {
      description: 'Grants you daily income',
      levels: [
        { building: townCenter, cost: { gold: 2000 } },
      ],
      icon: 'capitol',
      tier: 1,
    },
    'market': {
      description: 'Allows to trade resources',
      levels: [
        { building: market, cost: { gold: 1500 } }
      ],
      icon: 'gavel',
      tier: 1,
    },
    "magic-school": {
      description: 'Allows you to learn spells for your hero',
      levels: [
        { building: magicScool, cost: { gold: 1500, gems: 2 } }
      ],
      icon: 'burning-book',
      tier: 2,
    },
    'tavern': {
      description: 'Allows to hire neutral units',
      levels: [
        { building: tavern, cost: { gold: 1250 } },
      ],
      icon: 'hood',
      tier: 2,
    },
    'fate-halls': {
      description: 'Allows to develop your hero',
      levels: [
        { building: { name: 'Halls of Fate' }, cost: { gold: 1000 } },
      ],
      icon: 'barrier',
      tier: 2,
    },
    'training-camp': {
      description: 'Trains Pikemans',
      levels: [
        /*
         todo: High cost on early buildings makes them hard to use.
          For now I'll lower their cost, but I can think of either lowering units cost,
          or increasing resources/think of new resource types in general.

          In general, keep buildings prices low, units are already expensive enough.
         */

        /*
          Building points idea:

          Also what I think of: Buildings might get prerequisites later on, like
          some building can only be built after certain buildings are constructed.

          But could there be something as building points, that restrict player
          from building more than given amount of training buildings in this town?

          For example, Castle heroes are going to start with 2 building points.
          Some heroes might start with 3 points (talents might have effect there).
          Building points are gained every new week. So, player will have to choose,
          which unit types he is going to invest into.

          Also, some other buildings might require building points, so, for instance,
          a player will might need to decide, which special building he might want
          to build: Magic School, because it provides better spells and recharges
          your mana, or Town Center level 2 that brings you money each day.

          For example, some player might want to get building that will restore
          his mana daily as early as possible, so he will be looking for strategies
          to do so.

          But regardless, I like the idea of having points, because it defines an
          investment, a certain build. Player might take some risks, sell items,
          all in order to build something important.

          Also, this will give more meaning to new towns. When player enters new
          town, it might have lower amount of building points at the beginning.
          New town will allow to reinforce player's investments, for instance
          increase production rate of some unit by spending new precious building points
          into production building for this unit type. Or it will open possibility for
          player to build something player cannot yet build in his town, because there
          are not enough building points.

          Also it might make it simpler for player to think about building his town,
          because he will only have a couple of points to spare at the beginning,
          while getting +1 point only at the beginning of the next week.

          There also might be some mechanic to gain points from the map.. like,
          visiting Builders Guild will grant to player building point, might also be
          in exchange for some resources.

          In general, it feels like a fun and interesting idea, rather than
          just having buildings in required order. People might come up with cool ideas
          and try to squeeze out early resources to get something strong early.

          And also, then early buildings can be not very expensive, because building
          points becomes most valuable thing early on.
        */
        /*
         Extending original idea, some buildings might have a random chance of being
         constructed from the beginning (might also depend on hero).

         Heroes might also have different start for building points. Strong mages
         might have less points for training buildings, but may start with Magic School
         constructed.

         Also, players might choose what they are going to invest into by looking at
         the map first, because sometimes there might be, for example, 2 locations
         that increase Firebirds growth in the town, which will give an ability to
         produce more Firebirds than usually would be allowed.
        */
        { building: trainingCamp, cost: { gold: 300 } },
        { building: upgradedTrainingCamp, cost: { gold: 150, wood: 1 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'archers-outpost': {
      description: 'Trains Archers',
      levels: [
        { building: archersOutpost, cost: { gold: 420, wood: 2 } },
      ],
      icon: 'arrow-cluster',
      tier: 1,
    },
    'halls-of-knights': {
      description: 'Trains Knights',
      levels: [
        { building: hallsOfKnights, cost: { gold: 500, wood: 2 } },
      ],
      icon: 'crossed-swords',
      tier: 2,
    },
    'cavalry-halls': {
      description: 'Trains Cavalry',
      levels: [
        { building: cavalryStalls, cost: { gold: 575, wood: 2 } },
      ],
      icon: 'horseshoe',
      tier: 3,
    },
    'magic-tower': {
      description: 'Trains Mystical Birds and Firebirds',
      levels: [
        { building: magicTower, cost: { gold: 625, wood: 1 } },
      ],
      icon: 'tower',
      tier: 4,
    },
  },
};

humansFraction.setTownBase(castleTownBase);
