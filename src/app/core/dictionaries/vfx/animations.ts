import { AnimationElementType, AnimationIconElement, EffectAnimation } from "../../model/vfx-api/vfx-api.types";

const getIconElement = (iconName: string, id: string): AnimationIconElement => ({
    icon: iconName,
    id: id,
    type: AnimationElementType.Icon,
});

export const LightningAnimation: EffectAnimation = {
    elements: [
        getIconElement('focused-lightning', 'l-main'),
        getIconElement('focused-lightning', 'l-blur'),
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
        getIconElement('fire', 'fire-main'),
        getIconElement('fire', 'fire-blur'),
        getIconElement('fire', 'fire-pulse'),
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
        getIconElement('batwings', 'bw-1'),
        getIconElement('batwings', 'bw-2'),
        getIconElement('batwings', 'bw-3'),
        getIconElement('batwings', 'bw-blur'),
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

export const FloatingMessageAnimation: EffectAnimation = {
    elements: [
        { id: 'msg', type: AnimationElementType.Customizable },
    ],
    elemsKeyframes: {
        msg: [
            {
                fontSize: '13px',
            },
            {
                offset: 0.3,
                opacity: 1,
                transform: 'translate(10px, -50px) scale(1.3)',
            },
            {
                opacity: 0,
                transform: 'translate(20px, -100px) scale(0.8)',
            }
        ]
    },
    elemsDefaultStyles: {
        msg: {
            opacity: 0.3,
            fontSize: '15px',
        }
    },
    config: { layout: "default" },
};

/* 0% {
        opacity: 0;
        font-size: 13px;
        top: 50%;
        left: 50%;
    }

    30% {
        opacity: 1;
        font-size: 21px;
        top: -34%;
        left: 60%;
    }

    100% {
        opacity: 0;
        font-size: 14px;
        top: -35%;
        left: 75%;
    }
*/


export const EnchantAnimation: EffectAnimation = {
    elements: [
        getIconElement('fire-ring', 'fr-main'),
        getIconElement('fire-ring', 'fr-blur'),
        getIconElement('fire-ring', 'fr-pulse'),
    ],
    elemsKeyframes: {
        'fr-main': [
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
        'fr-blur': [
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
        'fr-pulse': [
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
        'fr-main': {
            fontSize: '64px',
            color: 'pink',
            opacity: '1',
        },
        'fr-blur': {
            fontSize: '64px',
            color: 'violet',
            filter: 'blur(6px)',
            opacity: '1',
            mixBlendMode: 'hard-light'
        },
        'fr-pulse': {
            fontSize: '64px',
            color: 'pink',
            opacity: '0.2',
            transform: 'translate(-50%, -50%) scale(1)',
            mixBlendMode: 'hard-light'
        },
    },
    config: {
        layout: 'default',
    }
};