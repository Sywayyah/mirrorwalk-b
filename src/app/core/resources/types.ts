import { ImgIconName } from '../assets';

export enum ResourceType {
  Gold = 'gold',
  Wood = 'wood',
  RedCrystals = 'redCrystals',
  Gems = 'gems',
  // new possible resource, pearls of violet color, used for magic activities
  // Pearls, Magic Pearls
  // Pearls = 'pearls',
}

export interface ResourcesModel {
  [ResourceType.Gold]: number;
  [ResourceType.Wood]: number;

  [ResourceType.RedCrystals]: number;
  [ResourceType.Gems]: number;
}

export type Resources = Partial<ResourcesModel>;

export const resourceDetailsMapping: Record<
  ResourceType,
  { name: string; imgIcon: ImgIconName }
> = {
  [ResourceType.Gold]: {
    imgIcon: 'gold',
    name: 'Gold',
  },
  [ResourceType.Wood]: {
    name: 'Wood',
    imgIcon: 'wood',
  },
  [ResourceType.RedCrystals]: {
    name: 'Crystals',
    imgIcon: 'crystals',
  },
  [ResourceType.Gems]: {
    name: 'Gems',
    imgIcon: 'gems',
  },
};
