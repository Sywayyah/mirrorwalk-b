import { ActionCard, ActionCardTypes } from './types';

export const AttackActionCard: ActionCard = {
  title: 'Attack',
  icon: 'crossed-swords',
  type: ActionCardTypes.LocationAction,
  bgColor: '#f33b4e',
  description: `Attack the camp.`,
};

export const InitiativeAttackCard: ActionCard = {
  title: 'Initiative Attack',
  icon: 'groundbreaker',
  type: ActionCardTypes.LocationAction,
  bgColor: 'red',
  description: 'Attack the camp, allowing your hero to cast a spell at the beginning of the fight.',
};

export const VisitActionCard: ActionCard = {
  title: 'Visit',
  icon: 'trail',
  type: ActionCardTypes.LocationAction,
  bgColor: '#ffa446',
  description: `Visit the location. Takes 1 action point until location says otherwise.`,
};
