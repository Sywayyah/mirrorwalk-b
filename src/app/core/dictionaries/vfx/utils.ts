import { AnimationElement, EffectAnimation } from "../../model/vfx-api/vfx-api.types";


export const createAnimation = (configs: [AnimationElement, Keyframe[], Record<string, string | number>][]) => {
    const newAnimation: EffectAnimation = {
        config: {
            layout: "default",
        },
        elements: [],
        elemsKeyframes: {},
        elemsDefaultStyles: {},
    };

    configs.forEach(([elem, keyframes, defaultStyles]) => {
        newAnimation.elements.push(elem);
        newAnimation.elemsKeyframes[elem.id] = keyframes;
        newAnimation.elemsDefaultStyles[elem.id] = defaultStyles;
    });

    return newAnimation;
};
