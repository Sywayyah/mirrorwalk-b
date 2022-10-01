import { CustomizableAnimationData } from "../model/vfx-api/vfx-api.types";


export const getDamageParts = (damage: number, loss: number, isRanged: boolean = false): CustomizableAnimationData => {
    return {
        parts: [
            { type: 'plainPart', icon: isRanged ? 'broadhead-arrow' : 'sword', text: damage, color: 'red' },
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
