import { structsPreset1 } from '../../locations';
import { GamePreparationFinished, PrepareGameEvent } from '../events/events';
import { TriggersRegistry } from '../registry';
import { DefaultGameModes } from '../types';

TriggersRegistry.register(PrepareGameEvent, {
  // supply some more api here
  fn: (event: { gameMode: DefaultGameModes }, { events }) => {
    if (event.gameMode !== DefaultGameModes.Normal) {
      return;
    }

    console.log('Structures are prepared.');

    events.dispatch(GamePreparationFinished({ structures: structsPreset1 }));
  },
});
