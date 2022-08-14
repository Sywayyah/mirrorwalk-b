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


export const getPlainAppearanceFrames = () => {
    return [
        {
            opacity: '0',
        },
        {
            opacity: '1',
            offset: 0.25,
        },
        {
            opacity: '1',
            offset: 0.35,
        },
        {
            offset: 0.76,
            opacity: '0',
        },
        {
            opacity: '0',
        },
    ];
};

export const getPlainBlurFrames = () => {
    return [
        {
            filter: 'blur(10px)',
        },
        {
            filter: 'blur(0px)',
            offset: 0.4,
        },
        {
            filter: 'blur(0px)',
            opacity: 0,
        }
    ];
};

export const getPlainPulseFrames = () => {
    return [
        {
            opacity: '0',
        },
        {
            opacity: '0.2',
            transform: 'translate(-50%, -50%) scale(1.2)',
            offset: 0.25,
        },
        {
            opacity: '0.3',
            transform: 'translate(-50%, -50%) scale(1.5)',
            offset: 0.35,
        },
        {
            offset: 0.76,
            transform: 'translate(-50%, -50%) scale(1.6)',
            opacity: '0',
        },
        {
            opacity: '0',
        },
    ];
};

export const getReversePulseKeyframes = (offsetDelay: number = 0) => {
    const transform = 'translate(-50%, -50%) scale(1)';

    return [
        {
            opacity: 0,
            offset: 0.001 + offsetDelay,
        },
        {
            opacity: 0.3,
            transform: transform,
            offset: 0.3 + offsetDelay,
        },
        {
            opacity: 0.3,
            transform: transform,
            offset: 0.5 + offsetDelay,
        },
        {
            opacity: 0.3,
            transform: transform,
        },
        {
            opacity: 0,
            transform: transform,

        }
    ];
};