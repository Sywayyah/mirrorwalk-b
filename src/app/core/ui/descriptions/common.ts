import type { SpellDescription } from '../../spells';
import { DescHtmlElement, DescriptionElementType } from './types';

export function strPercent(num: number): string {
  return `${Math.floor(num * 100)}%`;
}

export function heroDescrElem(text: string): DescHtmlElement {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: text,
  };
}

export function spellDescrElem(text: string): DescHtmlElement {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `<div class="spell-descr">${text}</div>`,
  };
}

export function spellStatsElem(stats: string[]): DescHtmlElement {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `
      <div class="spell-stats">
        ${stats.map((line) => `<div class="stat">${line}</div>`).join('')}
      </div>
    `,
  };
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
