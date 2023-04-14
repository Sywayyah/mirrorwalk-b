import { structsPreset1 } from '../../locations';
import { LevelMap } from '../../maps';
import { Triggers } from '../events/events';
import { TriggersRegistry } from '../registry';
import { DefaultGameModes } from '../types';

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
