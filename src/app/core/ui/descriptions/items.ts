import type { ItemObject } from '../../items';
import { modsFormatters } from '../../modifiers';
import { DescHtmlElement, DescriptionElementType } from './types';

function getItemModHtmlElem(text: string): string {
  return `<div class="item-mod">${text}</div>`;
}


export function itemStatsDescr(item: ItemObject): DescHtmlElement {
  const itemStaticMods = item.baseType.staticMods;

  const mods = Object.entries(itemStaticMods).map(([modName, modValue]) => {

    if (modName in modsFormatters) {
      /* cast to any */
      return getItemModHtmlElem((modsFormatters as any)[modName](modValue));
    }

    return getItemModHtmlElem(`${modValue} ${modName}`);
  }).join('');

  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `
      <div class="item-mods">
        ${mods}
      </div>
    `,
  }
}
