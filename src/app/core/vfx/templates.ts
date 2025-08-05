import { EffectAnimation } from '../api/vfx-api';
import { VfxId } from '../entities';
import {
  createAnimation,
  getIconElement,
  getPlainAppearanceFrames,
  getPlainBlurFrames,
  getPlainPulseFrames,
  getReversePulseKeyframes,
} from './utils';

export const simpleConvergentBuffAnimation = (id: VfxId, icon: string, color: string = 'rgb(244 162 124)') =>
  createAnimation(id, [
    [
      getIconElement(icon, 'fire-main'),
      getPlainAppearanceFrames(),
      {
        fontSize: '64px',
        color,
        opacity: '1',
      },
    ],
    [
      getIconElement(icon, 'fire-blur'),
      getPlainBlurFrames(),
      {
        fontSize: '64px',
        color,
        filter: 'blur(6px)',
        opacity: '1',
        mixBlendMode: 'hard-light',
      },
    ],
    [
      getIconElement(icon, 'fire-pulse'),
      getPlainPulseFrames(),
      {
        fontSize: '64px',
        color,
        opacity: '0.2',
        transform: 'translate(-50%, -50%) scale(1)',
        mixBlendMode: 'hard-light',
      },
    ],
  ]);

export function frontStackingBuffAnimation(id: VfxId, icon: string, color: string): EffectAnimation {
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

  return createAnimation(id, [
    [getIconElement(icon, 'bw-1'), getReversePulseKeyframes(), getBwDefaultStyles()],
    [getIconElement(icon, 'bw-2'), getReversePulseKeyframes(0.2), getBwDefaultStyles()],
    [getIconElement(icon, 'bw-3'), getReversePulseKeyframes(0.4), getBwDefaultStyles()],
    [
      getIconElement(icon, 'bw-blur'),
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
        },
      ],
      {
        transform: 'translate(-50%, -50%) scale(1.5)',
        fontSize: '64px',
        color,
        filter: 'blur(6px)',
        opacity: '0',
        mixBlendMode: 'hard-light',
      },
    ],
  ]);
}
