import { ActionCardTypes } from './types';
import { createActionCard } from './utils';

// doubles the cost on your actions?
export const ThunderActionCard = createActionCard({
  id: '#acard-thunder',

  title: 'Thunder',
  icon: 'lightning-storm',
  type: ActionCardTypes.Event,
  description: `Your hero loses 1 action point.`,
});

export const RainbowActionCard = createActionCard({
  id: '#acard-rainbow',

  title: 'Rainbow',
  icon: 'sunbeams',
  type: ActionCardTypes.Event,
  description: `Your hero gains +1 action point.`,
});

export const SnowfallActionCard = createActionCard({
  id: '#acard-snowfall',

  title: 'Snowfall',
  icon: 'frost-emblem',
  type: ActionCardTypes.Event,
  description: `Your army is slowed down by 25% during the combat.`,
});

export const RaidersActionCard = createActionCard({
  id: '#acard-raiders',

  title: 'Raiders',
  icon: 'demolish',
  type: ActionCardTypes.Event,
  description: `Raiders are approaching. At the end of the day, you will lose a random building on the map.`,
});
