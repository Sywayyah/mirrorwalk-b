import { DefaultGameModes, DisplayPlayerRewardPopup, PlayerLevelsUp, Triggers } from '../../events';
import { structsPreset1 } from '../../locations';
import { LevelMap } from '../../maps';
import { TriggersRegistry } from '../registry';

TriggersRegistry.register(Triggers.PrepareGameEvent, {
  // supply some more api here
  fn: (event: { gameMode: DefaultGameModes }, { events }) => {
    if (event.gameMode !== DefaultGameModes.Normal) {
      return;
    }

    console.log('Structures are prepared.');

    const gameMap = new LevelMap({
      mapDimensions: { heightInCells: 11, widthInCells: 22, cellSize: 86 },
      structures: structsPreset1,
    });

    events.dispatch(Triggers.GamePreparationFinished({ map: gameMap }));
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
                // extract into some api
                if (spell) {
                  spell.currentLevel += 1;
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
