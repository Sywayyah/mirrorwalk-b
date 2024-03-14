import { ActionCardTypes } from './types';
import { createActionCard } from './utils';

export const AttackActionCard = createActionCard({
  id: '#acard-loc-attack',

  title: 'Attack',
  icon: 'crossed-swords',
  type: ActionCardTypes.LocationAction,
  bgColor: '#f33b4e',
  description: `Attack the camp.`,
});

export const InitiativeAttackCard = createActionCard({
  id: '#acard-init-attack',

  title: 'Initiative Attack',
  icon: 'groundbreaker',
  type: ActionCardTypes.LocationAction,
  bgColor: 'red',
  description: 'Attack the camp, allowing your hero to cast a spell at the beginning of the fight.',
});

export const VisitActionCard = createActionCard({
  id: '#acard-visit',

  title: 'Visit',
  icon: 'trail',
  type: ActionCardTypes.LocationAction,
  bgColor: '#ffa446',
  description: `Visit the location. Takes 1 action point until location says otherwise.`,
});
