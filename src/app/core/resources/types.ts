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
