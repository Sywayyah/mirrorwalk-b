import { registerEntity } from '../entities';
import { ActionCard } from './types';

export const iconElem = (iconName: string) => `<i class="ra ra-${iconName}"></i>`;

export const actionIcon = (points: number) => points + iconElem('feather-wing');
export const manaIcon = (points: number) => points + iconElem('crystal-ball');

export function createActionCard(actionCard: ActionCard): ActionCard {
  registerEntity(actionCard);
  return actionCard;
}
