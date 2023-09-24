import { MeditateActionCard, SkipDayActionCard } from '../../action-cards/player-actions';
import { DefaultGameModes, DisplayPlayerRewardPopup, PlayerLevelsUp, PlayersInitialized, Triggers } from '../../events';
import { Fraction } from '../../fractions';
import { constellationFraction } from '../../fractions/constellation/fraction';
import { LevelMap } from '../../maps';
import { START_LOC_ID, structsPreset1 } from '../../structures';
import { TriggersRegistry } from '../registry';

TriggersRegistry.register(Triggers.PrepareGameEvent, {
  // supply some more api here
  fn: (event: { gameMode: DefaultGameModes, selectedFraction?: Fraction<string> }, { events }) => {
    if (event.gameMode !== DefaultGameModes.Normal) {
      return;
    }

    let startingLocId = START_LOC_ID;

    // change starting loc id depending on selected fraction
    if (event.selectedFraction === constellationFraction) {
      startingLocId = 'const-start-1';
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

TriggersRegistry.register(PlayersInitialized, {
  fn: (_, api) => {
    api.players.getCurrentPlayer().actionCards = [
      { card: MeditateActionCard, count: 1 },
      { card: SkipDayActionCard, count: 2 },
    ];
  },
});

TriggersRegistry.register(PlayerLevelsUp, {
  fn: (event, { events, players }) => {

    // subcategories for rewards?
    // popups are overstacking
    events.dispatch(DisplayPlayerRewardPopup({
      title: `You reached level ${event.newLevel}`,
      subTitle: 'Choose your reward',
      rewards: [
        // for now, bring native abilities of hero to next level
        ...event.hero.spells
          .filter(spell => event.hero.base.initialState.abilities.includes(spell.baseType))
          .map((spell) => {
            return {
              display: {
                icon: spell.baseType.icon.icon,
                title: `Level ${spell.currentLevel + 1} ${spell.name}`
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
            title: '+4 to Max/Current Mana'
          },
          onSumbit: () => {
            const currentPlayer = players.getCurrentPlayer();

            const manaBonus = 4;
            players.addMaxManaToPlayer(currentPlayer, manaBonus);
            players.addManaToPlayer(currentPlayer, manaBonus);
          },
        }
      ],
    }));

  },
});
