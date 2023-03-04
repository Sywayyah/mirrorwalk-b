import { GamePreparationFinished, PrepareGameEvent } from '../events';
import { TriggersRegistry } from '../registry';
import { DefaultGameModes } from '../types';

TriggersRegistry.register(PrepareGameEvent, {
  // supply some more api here
  fn: (data: { gameMode: DefaultGameModes }, { events }) => {
    if (data.gameMode !== DefaultGameModes.Normal) {
      return;
    }

    console.log('Triggers Registry: events');

    events.dispatch(GamePreparationFinished({}));
  },
});
