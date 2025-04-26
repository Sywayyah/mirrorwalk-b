import { ImgIconSize } from '../../assets';
import { ResourceType } from '../../resources';

export enum DescriptionElementType {
  FreeHtml,
  Resource,
  Resources,
}

export type DescriptionElementVariant<
  T extends DescriptionElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  V extends object = {},
> = { type: T } & V;

// check in the future how well it works
export type DescriptionElement =
  | DescriptionElementVariant<DescriptionElementType.FreeHtml, { htmlContent: string }>
  | DescriptionElementVariant<
      DescriptionElementType.Resource,
      { resType: ResourceType; count?: number; iconSize?: ImgIconSize }
    >
  | DescriptionElementVariant<
      DescriptionElementType.Resources,
      { resources: { resType: ResourceType; count: number }[] }
    >;
