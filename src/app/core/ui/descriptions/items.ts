import type { ItemInstanceModel } from '../../items';
import { Modifiers, ModifiersModel } from '../../unit-types';
import { DescHtmlElement, DescriptionElementType } from './types';

function getItemModHtmlElem(text: string): string {
  return `<div class="item-mod">${text}</div>`;
}

const numMod = (num: number) => `${num >= 0 ? '+' : '-'}${num}`;

const modsFormatters: { [K in keyof Modifiers]: (val: ModifiersModel[K]) => string } = {
  playerBonusAttack: (val) => `${numMod(val)} Attack Rating`,
};


export function itemStatsDescr(item: ItemInstanceModel): DescHtmlElement {
  const itemStaticMods = item.baseType.staticMods;

  const mods = Object.entries(itemStaticMods).map(([modName, modValue]) => {

    if (modName in modsFormatters) {
      /* cast to any */
      return getItemModHtmlElem((modsFormatters as any)[modName](modValue));
    }

    return getItemModHtmlElem(`${modValue} ${modName}`);
  }).join();

  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `
      <div class="item-mods">
        ${mods}
      </div>
    `,
  }
}
