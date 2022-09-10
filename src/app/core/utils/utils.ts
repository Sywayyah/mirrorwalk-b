import { CustomizableAnimationData } from "../model/vfx-api/vfx-api.types";


export const getDamageParts = (damage: number, loss: number): CustomizableAnimationData => {
    return {
        parts: [
            { type: 'plainPart', icon: 'sword', text: damage, color: 'red' },
            { type: 'plainPart', icon: 'skull', text: loss, color: 'white' },
        ],
    };
};