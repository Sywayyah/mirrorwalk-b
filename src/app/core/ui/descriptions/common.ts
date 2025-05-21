import { ImgIconsPaths } from '../../assets';
import { resourceDetailsMapping, ResourceType } from '../../resources';
import type { SpellDescription } from '../../spells';
import { DescriptionElementType, DescriptionVariants } from './types';

export function strPercent(num: number): string {
  return `${Math.floor(num * 100)}%`;
}

export function heroDescrElem(text: string): DescriptionVariants['variants'] {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: text,
  };
}

export function spellDescrElem(text: string): DescriptionVariants['variants'] {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `<div class="spell-descr">${text}</div>`,
  };
}

export function spellStatsElem(stats: string[]): DescriptionVariants['variants'] {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `
      <div class="spell-stats">
        ${stats.map((line) => `<div class="stat">${line}</div>`).join('')}
      </div>
    `,
  };
}

export function resourceIcon(res: ResourceType): string {
  return `<img src="assets/${ImgIconsPaths[resourceDetailsMapping[res].imgIcon]}" />`;
}

export function spellStatElem(stat: string, value: string | number): string {
  return `
    <span class="name">${stat}</span> <span class="value">${value}</span>
  `;
}

export function spellPlainDescription(text: string): SpellDescription {
  return {
    descriptions: [spellDescrElem(text)],
  };
}

export const DescrElems = {
  heroDescrElem,
  spellDescrElem,
  spellStatElem,
};
