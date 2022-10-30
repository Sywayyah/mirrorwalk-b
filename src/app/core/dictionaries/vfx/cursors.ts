import { EffectAnimation } from "../../model/vfx-api/vfx-api.types";
import { createAnimation, getReversePulseKeyframes, getPlainPulseFrames, getCustomizableElement, getIconElement } from "./utils";

const CursorStyles = {
    textShadow: '0px 0px 5px rgba(0, 0, 0, 1)',
};


export const StaticCursorAnimation: EffectAnimation = createAnimation([
    [
        getCustomizableElement('elem'),
        [],
        {
            fontSize: '24px',
            position: 'relative',
            top: '17px',
            left: '10px',
            color: 'white',
            ...CursorStyles,
        },
    ],
]);

export const SpellCastCursorAnimation: EffectAnimation = createAnimation([
    [
        getIconElement('burning-book', 'bm'),
        [],
        {
            fontSize: '34px',
            color: '#bfcbff',
            opacity: 0.7,
            // mixBlendMode: 'color-dodge',
            ...CursorStyles,
        },
    ],

    [
        getIconElement('burning-book', 'bm2'),
        getReversePulseKeyframes(0, 0.2),
        {
            fontSize: '34px',
            color: '#bfcbff',
            // mixBlendMode: 'color-dodge',
            mixBlendMode: 'screen',
        },
    ],
    [
        getIconElement('burning-book', 'book-blur'),
        getPlainPulseFrames(),
        {
            fontSize: '36px',
            filter: 'blur(6px)',
            color: '#98abff',
            // mixBlendMode: 'color-dodge',
            mixBlendMode: 'screen'
        },
    ],
    [
        getIconElement('burning-book', 'book-blur2'),
        getPlainPulseFrames(),
        {
            fontSize: '36px',
            filter: 'blur(6px)',
            color: '#98abff',
            // mixBlendMode: 'color-dodge'
        },
    ],

]);
