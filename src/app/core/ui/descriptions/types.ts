import { ImgIconSize } from '../../assets';
import { ResourceType } from '../../resources';
import { Variantable } from '../../utils';

export enum DescriptionElementType {
  FreeHtml,
  Resource,
  Resources,
}

export type DescriptionVariants = Variantable<
  DescriptionElementType,
  {
    [DescriptionElementType.FreeHtml]: { htmlContent: string };
    [DescriptionElementType.Resource]: { resType: ResourceType; count?: number; iconSize?: ImgIconSize };
    [DescriptionElementType.Resources]: { resources: { resType: ResourceType; count: number }[] };
  }
>;
