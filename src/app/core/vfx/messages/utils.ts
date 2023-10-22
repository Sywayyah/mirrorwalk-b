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

export const messageWrapper = (msg: string, { fontSize = 15, width = 100 }: { fontSize?: number, width?: number } = {}) =>
  `<div style="margin-top: 4px; text-align: center; width: ${width}px; font-size:${fontSize}px; background:rgba(0,0,0,0.6); padding: 2px; border-radius: 5px;">${msg}</div>`;


export const getLifeStealParts = (healedUnits: number, stolenLife: number): CustomizableAnimationData => {
  return {
    html: messageWrapper(`
      <div style="">${getHtmlRaIcon({ icon: 'bat-sword', iconColor: 'red' })} ${stolenLife}</div>
      <div style="">${getHtmlRaIcon({ icon: 'double-team', iconColor: '#91edb8' })}${uiSignedNum(healedUnits)}</div>
    `, { width: 50 }),
  };
};

export const getLifeStealParts2 = (healedUnits: number, stolenLife: number): CustomizableAnimationData => {
  return {
    html: messageWrapper(`
      <div style=" font-size: 15px">Lifesteal: ${getHtmlRaIcon({ icon: 'health', iconColor: 'red' })} ${stolenLife}</div>
      <div style=" font-size: 13px">Healed: ${uiSignedNum(healedUnits)}</div>
    `),
  };
};
