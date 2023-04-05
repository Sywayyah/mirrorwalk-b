import { EffectAnimation } from '../api/vfx-api';
import { frontStackingBuffAnimation, simpleConvergentBuffAnimation } from './templates';
import { createAnimation, getCustomizableElement, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getPlainPulseFrames } from './utils';

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

export const FireAnimation: EffectAnimation = simpleConvergentBuffAnimation('fire');




export const FrightAnimation: EffectAnimation = frontStackingBuffAnimation('batwings', 'rgba(218, 137, 204, 0.78)');

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
