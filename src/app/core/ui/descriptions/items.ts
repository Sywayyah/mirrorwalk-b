import type { Item, ItemBaseModel } from '../../items';
import { ModifiersModel, formatMod } from '../../modifiers';
import { DescHtmlElement, DescriptionElementType } from './types';

function getItemModHtmlElem(text: string): string {
  return `<div class="item-mod">${text}</div>`;
}


export function itemStatsDescr(itemBase: ItemBaseModel): DescHtmlElement {
  const itemStaticMods = itemBase.staticMods;

  const mods = Object.entries(itemStaticMods)
    .map(([modName, modValue]) => getItemModHtmlElem(formatMod(modName as keyof ModifiersModel, modValue)))
    .filter(Boolean)
    .join('');

  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `
      <div class="item-mods">
        ${mods}
      </div>
    `,
  }
}
