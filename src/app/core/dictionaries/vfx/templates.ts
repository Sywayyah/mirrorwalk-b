import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getPlainPulseFrames } from "./utils";

export const createFireAnimation = (icon: string) => createAnimation([
  [
    getIconElement(icon, 'fire-main'),
    getPlainAppearanceFrames(),
    {
      fontSize: '64px',
      color: 'rgb(244 162 124)',
      opacity: '1',
    },
  ],
  [
    getIconElement(icon, 'fire-blur'),
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
    getIconElement(icon, 'fire-pulse'),
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
