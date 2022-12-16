import { Resources, ResourceType } from './types';

export const resourceNames: Record<ResourceType, string> = {
  [ResourceType.Gems]: 'Gems',
  [ResourceType.Gold]: 'Gold',
  [ResourceType.RedCrystals]: 'Red Crystals',
  [ResourceType.Wood]: 'Wood',
} as const;

export interface FormattedResource {
  resName: string;
  count: number;
}

export function formattedResources(resources: Resources): { resName: string, count: number }[] {
  return Object.entries(resources).map(([res, count]: [string, number]) => ({
    resName: resourceNames[res as ResourceType],
    count: count,
  }));
}
