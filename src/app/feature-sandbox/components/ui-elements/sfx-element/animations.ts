
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