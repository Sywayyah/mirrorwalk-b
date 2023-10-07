import { ActionCard } from '../action-cards';
import { CustomizableAnimationData } from '../api/vfx-api';

export const uiPercent = (chanceNumber: number): string => `${Math.round(chanceNumber * 100)}`;
export const uiPercentSign = (chanceNumber: number): string => `${Math.round(chanceNumber * 100)}%`;

export const uiValueRange = (min: number, max: number) => min === max ? `${min} ` : `${min}-${max} `;

export const getDamageParts = (
  damage: number,
  loss: number,
  isRanged: boolean = false,
  blockedDamage: number = 0,
): CustomizableAnimationData => {
  return {
    parts: [
      { type: 'plainPart', icon: isRanged ? 'broadhead-arrow' : 'sword', text: damage, color: 'red' },
      ...(blockedDamage ? [{ type: 'plainPart', icon: 'shield', color: 'yellow', text: blockedDamage }] : []),
      { type: 'plainPart', icon: 'skull', text: loss, color: 'white' },
    ],
  };
};

export const getHealParts = (healCount: number, healValue: number): CustomizableAnimationData => {
  return {
    parts: [
      // { type: 'plainPart', icon: isRanged ? 'broadhead-arrow' : 'sword', text: damage, color: 'red' },
      { type: 'plainPart', icon: 'double-team', text: healCount, color: 'white' },
      { type: 'plainPart', icon: 'health', text: healValue, color: '#5fc960' },
    ],
  };
};

export const actionCardIcon = ({ icon, iconColor, bgColor }: ActionCard) => `<i class='ra ra-${icon}' style="background: ${bgColor}; color: ${iconColor}"></i>`;
export const actionCardEvent = (card: ActionCard) => `${actionCardIcon(card)} <span style="font-weight: 600;">${card.title}</span>`;
