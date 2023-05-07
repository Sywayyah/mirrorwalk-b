import { DefaultGameModes, PlayerLevelsUp, Triggers } from '../../events';
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
      mapDimensions: { heightInCells: 11, widthInCells: 22 },
      structures: structsPreset1,
    });

    events.dispatch(Triggers.GamePreparationFinished({ map: gameMap }));
  },
});

TriggersRegistry.register(PlayerLevelsUp, {
  fn: (event, { events }) => { console.log('Player gained level') },
});
