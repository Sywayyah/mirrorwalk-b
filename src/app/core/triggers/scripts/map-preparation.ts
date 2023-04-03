import { structsPreset1 } from '../../locations';
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

    events.dispatch(Triggers.GamePreparationFinished({ structures: structsPreset1 }));
  },
});
