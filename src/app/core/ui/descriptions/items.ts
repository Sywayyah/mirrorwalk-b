import type { ItemBaseType } from '../../items';
import { ModifiersModel, formatMod } from '../../modifiers';
import { DescriptionElementType, DescriptionVariants } from './types';

function getItemModHtmlElem(text: string): string {
  return `<div class="item-mod">${text}</div>`;
}

export function itemStatsDescr(itemBase: ItemBaseType): DescriptionVariants['variants'] {
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
  };
}
