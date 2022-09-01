import { EffectAnimation } from "../../model/vfx-api/vfx-api.types";
import { createAnimation, getCustomizableElement, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getPlainPulseFrames, getReversePulseKeyframes } from "./utils";

export const LightningAnimation: EffectAnimation = createAnimation([
    [
        getIconElement('focused-lightning', 'l-main'),
        [
            {
                opacity: '0',
            },
            {
                opacity: '1',
                offset: 0.05,
            },
            {
                opacity: '1',
                offset: 0.15
            },
            {
                opacity: '0',
                offset: 0.16,
            },
            {
                opacity: '0',
                offset: 0.20,
            },
            {
                opacity: '1',
                offset: 0.23,
            },
            {
                opacity: '0',
            },
        ],
        {
            fontSize: '64px',
            color: '#eaefff',
            opacity: '1',
        }
    ],
    [
        getIconElement('focused-lightning', 'l-blur'),
        [
            {
                filter: 'blur(10px)',
            },
            {
                filter: 'blur(10px)',
                offset: 0.4,
            },
            {
                filter: 'blur(0px)',
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(1)',

            }
        ],
        {
            transform: 'translate(-50%, -50%) scale(1.5)',
            fontSize: '64px',
            color: '#98abff',
            filter: 'blur(6px)',
            opacity: '1',
            mixBlendMode: 'hard-light'
        },
    ],
]);

export const FireAnimation: EffectAnimation = createAnimation([
    [
        getIconElement('fire', 'fire-main'),
        getPlainAppearanceFrames(),
        {
            fontSize: '64px',
            color: 'rgb(244 162 124)',
            opacity: '1',
        },
    ],
    [
        getIconElement('fire', 'fire-blur'),
        getPlainBlurFrames(),
        {
            fontSize: '64px',
            color: 'rgb(244 162 124)',
            filter: 'blur(6px)',
            opacity: '1',
            mixBlendMode: 'hard-light'
        }
    ],
    [
        getIconElement('fire', 'fire-pulse'),
        getPlainPulseFrames(),
        {
            fontSize: '64px',
            color: 'rgb(244 162 124)',
            opacity: '0.2',
            transform: 'translate(-50%, -50%) scale(1)',
            mixBlendMode: 'hard-light'
        },
    ]
]);


const getBwDefaultStyles = () => {
    // const transform = 'translate(-50%, -100%) scale(1)';
    const transform = 'translate(-50%, -50%) scale(3)';

    return {
        transform: transform,
        fontSize: '64px',
        color: 'rgb(213 197 223)',
        opacity: '0',
    };
};


export const FrightAnimation: EffectAnimation = createAnimation([
    [
        getIconElement('batwings', 'bw-1'),
        getReversePulseKeyframes(),
        getBwDefaultStyles(),
    ],
    [
        getIconElement('batwings', 'bw-2'),
        getReversePulseKeyframes(0.2),
        getBwDefaultStyles(),
    ],
    [
        getIconElement('batwings', 'bw-3'),
        getReversePulseKeyframes(0.4),
        getBwDefaultStyles(),
    ],
    [
        getIconElement('batwings', 'bw-blur'),
        [
            {
                filter: 'blur(10px)',
            },
            {
                filter: 'blur(10px)',
                offset: 0.4,
                opacity: 1,
            },
            {
                filter: 'blur(0px)',
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(1)',

            }
        ],
        {
            transform: 'translate(-50%, -50%) scale(1.5)',
            fontSize: '64px',
            color: 'rgba(218, 137, 204, 0.78)',
            filter: 'blur(6px)',
            opacity: '0',
            mixBlendMode: 'hard-light'
        },
    ],
]);

export const FloatingMessageAnimation: EffectAnimation = createAnimation([
    [
        getCustomizableElement('msg'),
        [
            {
                fontSize: '13px',
            },
            {
                offset: 0.3,
                opacity: 1,
                transform: 'translate(10px, -50px) scale(1.5)',
            },
            {
                opacity: 0,
                transform: 'translate(20px, -100px) scale(0.8)',
            }
        ],
        {
            opacity: 0.3,
            fontSize: '15px',
        }
    ]
]);

export const EnchantAnimation: EffectAnimation = createAnimation([
    [
        getIconElement('fire-ring', 'fr-main'),
        getPlainAppearanceFrames(),
        {
            fontSize: '64px',
            color: 'white',
            opacity: '1',
        },
    ],
    [
        getIconElement('fire-ring', 'fr-blur'),
        getPlainBlurFrames(),
        {
            fontSize: '64px',
            color: 'violet',
            filter: 'blur(6px)',
            opacity: '1',
            mixBlendMode: 'hard-light'
        },
    ],
    [
        getIconElement('fire-ring', 'fr-pulse'),
        getPlainPulseFrames(),
        {
            fontSize: '64px',
            color: 'pink',
            opacity: '0.2',
            transform: 'translate(-50%, -50%) scale(1)',
            mixBlendMode: 'hard-light'
        },
    ]
]);