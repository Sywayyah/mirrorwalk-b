import { createAnimation, getIconElement, getPlainBlurFrames, getReversePulseKeyframes } from "../utils";

const icon = 'cracked-shield';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(220 145 129)',
};


export const createCrackedShieldAnimation = (color = commonStyles.color) => createAnimation([
  [
    getIconElement(icon, 'fire-main'),
    [
      // todo: I can try to go with standalone properties
      // it would make animations easier to follow
      // and some styles could be applied by-default/globally for animation
      {
        opacity: '0',
        transform: 'translate(-50%, -50%) scale(0.8)',
      },
      {
        opacity: '1',
        offset: 0.25,
        transform: 'translate(-50%, -50%)  scale(1.2)',
      },
      {
        opacity: '1',
        offset: 0.35,
        transform: 'translate(-50%, -50%)  scale(1.6)',
      },
      {
        offset: 0.76,
        opacity: '0',
        transform: 'translate(-50%, -50%)  scale(1.9)',
      },
      {
        opacity: '0',
        transform: 'translate(-50%, -50%)  scale(2.1)',
      },
    ],
    {
      ...commonStyles,
      opacity: '1',
    },
  ],
  [
    getIconElement(icon, 'fire-blur'),
    getPlainBlurFrames(),
    {
      ...commonStyles,
      filter: 'blur(6px)',
      opacity: '1',
      mixBlendMode: 'hard-light'
    }
  ],
  [
    getIconElement(icon, 'fire-pulse'),
    getReversePulseKeyframes(),
    {
      ...commonStyles,
      opacity: '0.2',
      transform: 'translate(-50%, -50%) scale(1)',
      mixBlendMode: 'hard-light'
    },
  ]
]);