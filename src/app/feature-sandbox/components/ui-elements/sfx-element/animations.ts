
export interface Animation {
    elements: {
        id: string;
        icon: string;
    }[];
    elemsKeyframes: Record<string, Keyframe[]>;
    elemsDefaultStyles: Record<string, Record<string, unknown>>;
    config: {
        layout: 'default';
    };
}

export const LightningAnimation: Animation = {
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

export const FireAnimation: Animation = {
    elements: [{ icon: 'fire', id: 'fire-main' }, { icon: 'fire', id: 'fire-blur' }],
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
    },
    elemsDefaultStyles: {
        'fire-main': {
            fontSize: '64px',
            color: 'orange',
            opacity: '1',
        },
        'fire-blur': {
            fontSize: '64px',
            color: 'orange',
            filter: 'blur(6px)',
            opacity: '1',
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
    const transform = 'translate(-50%, -50%) scale(2)';

    return {
        transform: transform,
        fontSize: '64px',
        color: 'rgb(213 197 223)',
        opacity: '0',
    };
};

export const FrightAnimation: Animation = {
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