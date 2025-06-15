import { MeditateActionCard, RangersHorn } from '../../action-cards/player-actions';
import { UnitTypeId, resolveEntity } from '../../entities';
import { AddActionCardsToPlayer } from '../../events';
import { humansFaction } from '../../factions';
import { ActivityTypes, BuidlingBase, HiringActivity } from '../buildings';
import { SellingBuildingData, TownBase } from '../types';
import { createBuildingType } from '../utils';

function createHiringActivity(
  unitType: UnitTypeId,
  growth: number,
  unitGrowthGroup: string,
  upgrade: boolean = false,
): HiringActivity {
  return {
    type: ActivityTypes.Hiring,
    hiring: {
      unitTypeId: unitType,
      growth,
      refillDaysInterval: 7,
    },
    unitGrowthGroup,
    growth,
    growthIntervalDays: 7,
    upgrade,
  } as HiringActivity;
}

export type CastleTownBuildings =
  | 'town-center'
  | 'market'
  | 'magic-school'
  | 'items-market'
  | 'fate-halls'
  | 'tavern'
  | 'garrison'
  | 'training-camp'
  | 'archers-outpost'
  | 'halls-of-knights'
  | 'cavalry-halls'
  | 'magic-tower';

const townCenter: BuidlingBase = createBuildingType({
  id: '#build-castle-town-center',

  name: 'Town Center',
  description: 'Earns 500 gold each day.',
  config: {
    init({ players, localEvents }) {
      localEvents.on({
        NewDayBegins() {
          players.giveResourcesToPlayer(players.getCurrentPlayer(), {
            gold: 500,
          });
        },
      });
    },
  },
});

const market = createBuildingType({
  id: '#build-castle-market',

  name: 'Market',
  activity: {
    type: ActivityTypes.ResourceTrading,
  },
});

const highTower = createBuildingType({
  id: '#build-castle-high-tower',

  name: 'High Tower',
  description: 'Gives 1 Meditation action card instantly and at the beginning of each week.',
  config: {
    init({ localEvents, players, globalEvents }) {
      globalEvents.dispatch(
        AddActionCardsToPlayer({
          actionCardStacks: [{ card: MeditateActionCard, count: 1 }],
          player: players.getCurrentPlayer(),
        }),
      );

      localEvents.on({
        NewWeekStarts() {
          globalEvents.dispatch(
            AddActionCardsToPlayer({
              actionCardStacks: [{ card: MeditateActionCard, count: 1 }],
              player: players.getCurrentPlayer(),
            }),
          );
        },
      });
    },
  },
});

const tavern = createBuildingType({
  id: '#build-castle-tavern',

  activity: {
    type: ActivityTypes.Garrison,
  },
  name: 'Tavern',
  description: 'Allows to hire more units, including neutral ones, from your garrison',
  config: {
    init({ globalEvents, players, localEvents }) {
      globalEvents.dispatch(
        AddActionCardsToPlayer({
          actionCardStacks: [{ card: RangersHorn, count: 1 }],
          player: players.getCurrentPlayer(),
        }),
      );
      localEvents.on({
        Built() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.garrisons.set('castle-tavern', {
            groups: [{ cost: { gold: 200 }, count: 8, type: resolveEntity('#unit-neut-ranger-0') }],
            name: 'Castle Tavern',
          });
        },
        NewWeekStarts() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.garrisons.set('castle-tavern', {
            groups: [{ cost: { gold: 200 }, count: 8, type: resolveEntity('#unit-neut-ranger-0') }],
            name: 'Castle Tavern',
          });
        },
      });
    },
  },
});

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
const trainingCamp = createBuildingType({
  id: '#build-castle-taining-camp-1',

  name: 'Training Camp',
  description: 'Allows to train Pikemans that can be upgraded.',
  activity: createHiringActivity('#unit-h00', 18, 'pikeman'),
});

const upgradedTrainingCamp = createBuildingType({
  id: '#build-castle-taining-camp-2',

  name: 'Upg. Training Camp',
  description: 'Allows to hire and upgrade Halberdiers',
  activity: createHiringActivity('#unit-h00', 18, 'pikeman', true),
});

const archersOutpost = createBuildingType({
  id: '#build-castle-archers-1',

  name: 'Archers Outpost',
  description: 'Allows to train Archers',
  activity: createHiringActivity('#unit-h10', 12, 'archers'),
});

const upgradedArchersOutpost = createBuildingType({
  id: '#build-castle-archers-2',

  name: 'Upg. Archers Outpost',
  description: 'Allows to train Archers and Crossbowmen',
  activity: createHiringActivity('#unit-h10', 12, 'archers', true),
});

const hallsOfKnights = createBuildingType({
  id: '#build-castle-knights-1',

  name: 'Halls of Knights',
  description: 'Allows to train Knights',
  activity: createHiringActivity('#unit-h20', 4, 'knights'),
});

const cavalryStalls = createBuildingType({
  id: '#build-castle-cavalry-1',

  name: 'Cavalry Stalls',
  description: 'Allows to train Cavalry',
  activity: createHiringActivity('#unit-h30', 2, 'cavalry'),
});

const magicTower = createBuildingType({
  id: '#build-castle-magic-tower-1',

  name: 'Magic Tower',
  description: 'Allows to train Mystical Birds',
  activity: createHiringActivity('#unit-h40', 2, 'firebirds'),
});

const upgradedMagicTower = createBuildingType({
  id: '#build-castle-magic-tower-2',

  name: 'Upg. Magic Tower',
  description: 'Allows to train Mystical Birds and Firebirds',
  activity: createHiringActivity('#unit-h40', 2, 'firebirds', true),
});

const itemMarket = createBuildingType({
  id: '#build-castle-items-market',

  name: 'Item market',
  activity: {
    type: ActivityTypes.ItemsSelling,
  },
  description: 'Sells items',
  config: {
    init({ localEvents, thisBuilding }) {
      localEvents.on({
        Built() {
          thisBuilding.addCustomData<SellingBuildingData>({
            items: [
              '#item-iron-pike',
              '#item-magic-cape',
              '#item-irton-plate',
              '#item-kite-shield',
              // '#item-storm-pike',
              // '#item-battlemage-sword',
            ],
            selling: true,
          });
        },
      });
    },
  },
});

const hallsOfFate = createBuildingType({
  id: '#build-castle-halls-of-fate',
  name: 'Halls of Fate',
  activity: { type: ActivityTypes.HallsOfFate },
  // config:
  config: {
    init({ localEvents, players }) {
      localEvents.on({
        Built() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.addHallsOfFateConfig({
            id: 'Level 1',
            actionCards: [
              { cost: { gold: 300 }, count: 1, item: '#acard-blacksmithing' },
              { cost: { gold: 300 }, count: 2, item: '#acard-armor-forging' },
              { cost: { gold: 300 }, count: 2, item: '#acard-quiescence' },
            ],
            items: ['#item-storm-pike'],
            spells: [
              {
                cost: { gold: 1000 },
                item: '#spell-charged-strike',
              },
            ],
          });
        },
      });
    },
  },
});

const upgradedHallsOfFate = createBuildingType({
  id: '#build-castle-halls-of-fate-2',
  name: 'Halls of Fate Level 2',
  activity: { type: ActivityTypes.HallsOfFate },
  // config:
  config: {
    init({ localEvents, players }) {
      localEvents.on({
        Built() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.addHallsOfFateConfig({
            id: 'Level 2',
            actionCards: [
              { cost: { gold: 300 }, count: 2, item: '#acard-blacksmithing' },
              { cost: { gold: 300 }, count: 3, item: '#acard-armor-forging' },
              { cost: { gold: 250 }, count: 4, item: '#acard-quiescence' },
            ],
            items: ['#item-battlemage-sword'],
            spells: [
              {
                cost: { gold: 1000, gems: 1 },
                item: '#spell-meteor',
              },
            ],
          });
        },
      });
    },
  },
});

const garrison = createBuildingType({
  id: '#build-castle-garrison',
  name: 'Garrison',
  description: 'Allows to hire groups of units temporarily for reduced cost.',
  activity: { type: ActivityTypes.Garrison },
  config: {
    init({ localEvents, players }) {
      localEvents.on({
        Built() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.garrisons.set('castle-garrison', {
            groups: [
              { cost: { gold: 200 }, type: resolveEntity('#unit-h00'), count: 16 },
              { cost: { gold: 340 }, type: resolveEntity('#unit-h20'), count: 6 },
            ],
            name: 'Castle Garrison',
          });
        },
        NewWeekStarts() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.garrisons.set('castle-garrison', {
            groups: [
              { cost: { gold: 200 }, type: resolveEntity('#unit-h00'), count: 16 },
              { cost: { gold: 340 }, type: resolveEntity('#unit-h20'), count: 6 },
            ],
            name: 'Castle Garrison',
          });
        },
      });
    },
  },
});

// will be reworked, need somehow to process it in the faction itself
export const castleTownBase: TownBase<CastleTownBuildings> = {
  id: '#town-castle',
  name: 'Castle',
  availableBuildings: {
    'town-center': {
      baseName: 'Town Center',
      description: 'Grants you daily income',
      levels: [{ building: townCenter, cost: { gold: 1000 } }],
      icon: 'capitol',
      tier: 1,
    },
    'items-market': {
      baseName: 'Items Market',
      description: `Sells items`,
      icon: 'key-basic',
      levels: [{ building: itemMarket, cost: { gold: 500 } }],
      tier: 1,
    },
    market: {
      baseName: 'Market',
      description: 'Allows to trade resources',
      levels: [{ building: market, cost: { gold: 650, wood: 2 } }],
      icon: 'gavel',
      tier: 2,
    },
    'magic-school': {
      baseName: 'Magic School',
      description: 'Allows you to learn spells for your hero',
      levels: [{ building: highTower, cost: { gold: 1000, gems: 2 } }],
      icon: 'burning-book',
      tier: 2,
    },
    tavern: {
      baseName: 'Tavern',
      description: 'Allows to hire neutral units',
      levels: [{ building: tavern, cost: { gold: 850, wood: 1 } }],
      icon: 'hood',
      tier: 2,
    },
    garrison: {
      baseName: 'Garrison',
      description: 'Allows to hire units temorary',
      icon: 'guarded-tower',
      tier: 1,
      levels: [{ building: garrison, cost: { wood: 2, gold: 500 } }],
    },
    'fate-halls': {
      baseName: 'Halls of Fate',
      description: 'Allows to develop your hero',
      levels: [
        { building: hallsOfFate, cost: { gold: 1000 } },
        { building: upgradedHallsOfFate, cost: { gold: 1000, gems: 1 } },
      ],
      icon: 'barrier',
      tier: 3,
    },
    'training-camp': {
      baseName: 'Training Camp',
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
        { building: trainingCamp, cost: { gold: 450 } },
        { building: upgradedTrainingCamp, cost: { gold: 150, wood: 2 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'archers-outpost': {
      baseName: 'Archers Outpost',
      description: 'Trains Archers',
      levels: [
        { building: archersOutpost, cost: { gold: 500, wood: 2 } },
        { building: upgradedArchersOutpost, cost: { gold: 400, wood: 2 } },
      ],
      icon: 'arrow-cluster',
      tier: 1,
    },
    'halls-of-knights': {
      baseName: 'Halls of Knights',
      description: 'Trains Knights',
      levels: [{ building: hallsOfKnights, cost: { gold: 1000, wood: 5 } }],
      icon: 'crossed-swords',
      tier: 2,
    },
    'cavalry-halls': {
      baseName: 'Cavalry Halls',
      description: 'Trains Cavalry',
      levels: [{ building: cavalryStalls, cost: { gold: 1000, wood: 5 } }],
      icon: 'horseshoe',
      tier: 3,
    },
    'magic-tower': {
      baseName: 'Magic Tower',
      description: 'Trains Firebirds and Mystical Birds',
      levels: [
        { building: magicTower, cost: { gold: 1500, wood: 5 } },
        { building: upgradedMagicTower, cost: { gold: 600, wood: 5 } },
      ],
      icon: 'tower',
      tier: 4,
    },
  },
};

humansFaction.setTownBase(castleTownBase);
