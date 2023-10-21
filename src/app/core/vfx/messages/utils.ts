import { CustomizableAnimationData } from '../../api/vfx-api';
import { getHtmlRaIcon } from '../html-elements';
import { uiSignedNum } from '../ui-utils';

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

export const getLifeStealParts = (healedUnits: number, stolenLife: number): CustomizableAnimationData => {
  return {
    html: `
      <div style="width: 150px">Lifesteal: ${getHtmlRaIcon({ icon: 'health', iconColor: 'red' })} ${stolenLife}</div>
      <div style="width: 150px">Healed: ${uiSignedNum(healedUnits)}</div>
    `,
  };
};
