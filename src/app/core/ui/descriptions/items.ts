import type { Item } from '../../items';
import { modsFormatters } from '../../modifiers';
import { DescHtmlElement, DescriptionElementType } from './types';

function getItemModHtmlElem(text: string): string {
  return `<div class="item-mod">${text}</div>`;
}


export function itemStatsDescr(item: Item): DescHtmlElement {
  const itemStaticMods = item.baseType.staticMods;

  const mods = Object.entries(itemStaticMods)
    .map(([modName, modValue]) => {
      if (modName in modsFormatters) {
        /* cast to any */
        return getItemModHtmlElem((modsFormatters as any)[modName](modValue));
      }

      // return getItemModHtmlElem(`${modValue} ${modName}`)
      // filter out mods without formatter
      return '';
    })
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
