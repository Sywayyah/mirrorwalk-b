import { EffectAnimation } from '../../api/vfx-api';
import { createAnimation, getCustomizableElement, getHtmlElem } from '../utils';
import { } from './utils';

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

export const DroppingMessageAnimation: EffectAnimation = createAnimation([
  [
    getHtmlElem('msg'),
    [
      {
        offset: 0.0,
        opacity: 0,
        transform: 'translate(0, -50px)',
      },
      {
        offset: 0.2,
        opacity: 1,
        transform: 'translate(0, -10px)',
      },
      {
        offset: 0.8,
        opacity: 1,
        transform: 'translate(0, -10px)',
      },
      {
        opacity: 0,
        transform: 'translate(0, 0px)',
      }
    ],
    {
      // opacity: 0.3,
      fontSize: '15px',
    }
  ]
]);
