import { MeditateActionCard, SetupCampActionCard, SkipDayActionCard } from '../../action-cards/player-actions';
import {
  AddActionCardsToPlayer,
  DefaultGameModes,
  DisplayPlayerRewardPopup,
  HeroLevelsUp,
  NewWeekStarted,
  PlayersInitialized,
  PushPlainEventFeedMessage,
  Triggers,
} from '../../events';
import { Faction } from '../../factions';
import { constellationFaction } from '../../factions/constellation/faction';
import { LevelMap } from '../../maps';
import { createLocationsBranch, START_LOC_ID, structsPreset1, StructureDescription } from '../../structures';
import { GenericGuardStructure } from '../../structures/common/guard-location';
import { getResPileParams } from '../../structures/common/resource-pile';
import { ArmyGenerationModel } from '../../unit-types';
import { TriggersRegistry } from '../registry';

TriggersRegistry.register(Triggers.PrepareGameEvent, {
  // supply some more api here
  fn: (event: { gameMode: DefaultGameModes; selectedFaction?: Faction }, { events }) => {
    if (event.gameMode !== DefaultGameModes.Normal) {
      return;
    }

    const startingLocId = START_LOC_ID;

    // change starting loc id depending on selected faction
    if (event.selectedFaction === constellationFaction) {
      // todo: temp disable
      // startingLocId = 'const-start-1';
    }

    console.log('Structures are prepared.');

    const gameMap = new LevelMap({
      mapDimensions: { heightInCells: 27, widthInCells: 34, cellSize: 86 },
      structures: structsPreset1,
      startLocId: startingLocId,
    });

    events.dispatch(Triggers.GamePreparationFinished({ map: gameMap }));
  },
});

TriggersRegistry.register(Triggers.PrepareGameEvent, {
  // supply some more api here
  fn: (event: { gameMode: DefaultGameModes; selectedFaction?: Faction }, { events }) => {
    if (event.gameMode !== DefaultGameModes.SandboxScenario) {
      return;
    }

    const startingLocId = START_LOC_ID;

    // change starting loc id depending on selected faction
    if (event.selectedFaction === constellationFaction) {
      // todo: temp disable
      // startingLocId = 'const-start-1';
    }

    console.log('Structures are prepared.');

    const structsSandbox: StructureDescription[] = [
      {
        id: START_LOC_ID,
        x: 0,
        y: 0,
        icon: 'campfire',
      },
      ...createLocationsBranch('enemy', [
        {
          id: '1',
          pathTo: START_LOC_ID,
          toOuterBranch: true,
          x: 100,
          y: 100,
          icon: 'gold-bar',
          actionPoints: 1,
          struct: GenericGuardStructure,
          structParams: {
            name: 'Swamp',
            guards: {
              units: [['#unit-neut-poison-ivy-0', 20, 20, 3]],
              maxUnitGroups: 3,
              minUnitGroups: 3,
            } as ArmyGenerationModel,
          },
        },
      ]),
    ];

    const gameMap = new LevelMap({
      mapDimensions: { heightInCells: 27, widthInCells: 34, cellSize: 86 },
      structures: structsSandbox,
      startLocId: startingLocId,
    });

    events.dispatch(Triggers.GamePreparationFinished({ map: gameMap }));
  },
});

TriggersRegistry.register(PlayersInitialized, {
  fn: (_, api) => {
    // could rely on random
    const initialActionCards = [
      { card: SetupCampActionCard, count: Infinity },
      { card: MeditateActionCard, count: 1 },
      { card: SkipDayActionCard, count: 1 },
    ];

    const currentPlayer = api.players.getCurrentPlayer();

    api.events.dispatch(
      AddActionCardsToPlayer({
        player: currentPlayer,
        actionCardStacks: initialActionCards,
      }),
    );
  },
});

TriggersRegistry.register(NewWeekStarted, {
  fn: (_, api) => {
    const guardedStructures = api.actions
      .getMapStructures()
      .filter((struct) => !struct.visited && struct.guard?.length && !struct.generator?.disableWeeklyGuardRise);

    guardedStructures.forEach((guardedStruct) => {
      guardedStruct.guard?.forEach((guardUnitGroup) =>
        guardUnitGroup.addUnitsCount(Math.round(guardUnitGroup.count * 0.4)),
      );
    });

    api.events.dispatch(PushPlainEventFeedMessage({ message: `Guards in locations raised by 40%` }));
  },
});

TriggersRegistry.register(HeroLevelsUp, {
  fn: (event, { events, players }) => {
    // subcategories for rewards?
    // popups are overstacking
    events.dispatch(
      DisplayPlayerRewardPopup({
        title: `You reached level ${event.newLevel}`,
        subTitle: 'Choose your reward',
        rewards: [
          // for now, bring native abilities of hero to next level
          ...event.hero.spells
            .filter((spell) => event.hero.base.initialState.abilities.includes(spell.baseType.id))
            .map((spell) => {
              return {
                display: {
                  icon: spell.baseType.icon.icon,
                  title: `Level ${spell.currentLevel + 1} ${spell.name}`,
                },
                onSumbit: () => {
                  if (spell) {
                    spell.levelUp();
                  }
                },
              };
            }),

          {
            display: {
              icon: 'crystal-ball',
              title: '+4 to Max/Current Mana',
            },
            onSumbit: () => {
              const currentPlayer = players.getCurrentPlayer();

              const manaBonus = 4;
              players.addMaxManaToPlayer(currentPlayer, manaBonus);
              players.addManaToPlayer(currentPlayer, manaBonus);
            },
          },
        ],
      }),
    );
  },
});
