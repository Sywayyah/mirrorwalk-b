import { EffectAnimation } from "../../model/vfx-api/vfx-api.types";

export const LightningAnimation: EffectAnimation = {
    elements: [
        { icon: 'focused-lightning', id: 'l-main' },
        { icon: 'focused-lightning', id: 'l-blur' },
    ],
    elemsKeyframes: {
        'l-main': [
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
        'l-blur': [
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
    },
    elemsDefaultStyles: {
        'l-main': {
            fontSize: '64px',
            color: '#eaefff',
            opacity: '1',
        },
        'l-blur': {
            transform: 'translate(-50%, -50%) scale(1.5)',
            fontSize: '64px',
            color: '#98abff',
            filter: 'blur(6px)',
            opacity: '1',
            mixBlendMode: 'hard-light'
        },
    },
    config: {
        layout: 'default',
    }
};

export const FireAnimation: EffectAnimation = {
    elements: [
        { icon: 'fire', id: 'fire-main' },
        { icon: 'fire', id: 'fire-blur' },
        { icon: 'fire', id: 'fire-pulse' },
    ],
    elemsKeyframes: {
        'fire-main': [
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
        ],
        'fire-blur': [
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
        ],
        'fire-pulse': [
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
        ],
    },
    elemsDefaultStyles: {
        'fire-main': {
            fontSize: '64px',
            color: 'rgb(244 162 124)',
            opacity: '1',
        },
        'fire-blur': {
            fontSize: '64px',
            color: 'rgb(244 162 124)',
            filter: 'blur(6px)',
            opacity: '1',
            mixBlendMode: 'hard-light'
        },
        'fire-pulse': {
            fontSize: '64px',
            color: 'rgb(244 162 124)',
            opacity: '0.2',
            transform: 'translate(-50%, -50%) scale(1)',
            mixBlendMode: 'hard-light'
        },
    },
    config: {
        layout: 'default',
    }
};

const getBwKeyframes = (offsetDelay: number = 0) => {
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

export const FrightAnimation: EffectAnimation = {
    elements: [
        { icon: 'batwings', id: 'bw-1' },
        { icon: 'batwings', id: 'bw-2' },
        { icon: 'batwings', id: 'bw-3' },
        { icon: 'batwings', id: 'bw-blur' },
    ],
    elemsKeyframes: {
        'bw-1': getBwKeyframes(),
        'bw-2': getBwKeyframes(0.20),
        'bw-3': getBwKeyframes(0.40),
        'bw-blur': [
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
    },
    elemsDefaultStyles: {
        'bw-1': getBwDefaultStyles(),
        'bw-2': getBwDefaultStyles(),
        'bw-3': getBwDefaultStyles(),
        'bw-blur': {
            transform: 'translate(-50%, -50%) scale(1.5)',
            fontSize: '64px',
            color: 'rgba(218, 137, 204, 0.78)',
            filter: 'blur(6px)',
            opacity: '0',
            mixBlendMode: 'hard-light'
        },
    },
    config: {
        layout: 'default',
    }
};