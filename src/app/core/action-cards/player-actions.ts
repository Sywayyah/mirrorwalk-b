import { ActionCard, ActionCardTypes } from './types';

export const SkipDayActionCard: ActionCard = {
  title: 'Skip the day',
  icon: 'moon-sun',
  type: ActionCardTypes.PlayerAction,
  bgColor: '#283761',
  iconColor: 'rgb(255 198 90)',
  borderColor: 'rgb(255 198 90)',
  description: `You will immediately skip this day and receive 100 gold for each remaining action point left.`,
};

// could be that it takes full day and recovers more mana per action point left?
export const MeditateActionCard: ActionCard = {
  title: 'Meditate',
  icon: 'barrier',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `You restore 2 points of mana.`,
};
