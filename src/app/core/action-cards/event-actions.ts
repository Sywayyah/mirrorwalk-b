import { ActionCard, ActionCardTypes } from './types';

// doubles the cost on your actions?
export const ThunderActionCard: ActionCard = {
  title: 'Thunder',
  icon: 'lightning-storm',
  type: ActionCardTypes.Event,
  description: `Your hero loses 1 action point.`,
};

export const RainbowActionCard: ActionCard = {
  title: 'Rainbow',
  icon: 'sunbeams',
  type: ActionCardTypes.Event,
  description: `Your hero gains +1 action point.`,
};

export const SnowfallActionCard: ActionCard = {
  title: 'Snowfall',
  icon: 'frost-emblem',
  type: ActionCardTypes.Event,
  description: `Your army is slowed down by 25% during the combat.`,
};

export const RaidersActionCard: ActionCard = {
  title: 'Raiders',
  icon: 'demolish',
  type: ActionCardTypes.Event,
  description: `Raiders are approaching. At the end of the day, you will lose a random building on the map.`,
};
