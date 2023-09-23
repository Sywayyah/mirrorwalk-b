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
  description: `You restore 4 points of mana (+2 per point of Restoration specialty), consumes 2 action points. Restored every week.`,
};

export const RestoreActionCard: ActionCard = {
  title: 'Restore Mana',
  icon: 'barrier',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `You restore 3 points of mana (+2 per point of Restoration specialty), consumes 1 action point.`,
};

// Recruitting action
export const RecruitActionCard: ActionCard = {
  title: 'Recruit',
  icon: 'knight-helmet',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `Gives you additional units below tier 3, consumes 2 action points.`,
};


