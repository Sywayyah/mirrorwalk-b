import { CustomizableAnimationData } from "../model/vfx-api/vfx-api.types";


export const getDamageParts = (damage: number, loss: number, isRanged: boolean = false): CustomizableAnimationData => {
    return {
        parts: [
            { type: 'plainPart', icon: isRanged ? 'broadhead-arrow' : 'sword', text: damage, color: 'red' },
            { type: 'plainPart', icon: 'skull', text: loss, color: 'white' },
        ],
    };
};