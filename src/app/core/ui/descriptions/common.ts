import { DescHtmlElement, DescriptionElementType } from './types';

export function spellDescrElem(text: string): DescHtmlElement {
  return {
    type: DescriptionElementType.FreeHtml,
    htmlContent: `<div class="spell-descr">${text}</div>`,
  };
}
