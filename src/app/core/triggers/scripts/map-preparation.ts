import { structsPreset1 } from '../../locations';
import { TriggerEvents } from '../events/events';
import { TriggersRegistry } from '../registry';
import { DefaultGameModes } from '../types';

TriggersRegistry.register(TriggerEvents.PrepareGameEvent, {
  // supply some more api here
  fn: (event: { gameMode: DefaultGameModes }, { events }) => {
    if (event.gameMode !== DefaultGameModes.Normal) {
      return;
    }

    console.log('Structures are prepared.');

    events.dispatch(TriggerEvents.GamePreparationFinished({ structures: structsPreset1 }));
  },
});
