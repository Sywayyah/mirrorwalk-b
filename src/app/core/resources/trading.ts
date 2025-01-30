import { ResourceType } from './types';

export const resourcesCostInGold: Record<ResourceType, number> = {
  [ResourceType.Gold]: 1,
  [ResourceType.Wood]: 50,
  [ResourceType.Gems]: 110,
  [ResourceType.RedCrystals]: 500,
};
