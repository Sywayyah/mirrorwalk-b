

export enum DescriptionElementType {
  FreeHtml,
}


export interface DescriptionElement<T extends DescriptionElementType = DescriptionElementType> {
  type: T;
}

type DescElement<T extends DescriptionElementType, Props extends object> = DescriptionElement<T> & Props;


export type DescHtmlElement = DescElement<DescriptionElementType.FreeHtml, { htmlContent: string }>;
