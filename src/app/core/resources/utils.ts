import { Resources, ResourceType } from './types';

export const resourceNames: Record<ResourceType, string> = {
  [ResourceType.Gems]: 'Gems',
  [ResourceType.Gold]: 'Gold',
  [ResourceType.RedCrystals]: 'Red Crystals',
  [ResourceType.Wood]: 'Wood',
} as const;

export interface FormattedResource {
  resName: ResourceType;
  type: ResourceType;
  count: number;
}

export function formattedResources(resources: Resources): FormattedResource[] {
  return Object.entries(resources).map(([res, count]: [string, number]) => ({
    resName: resourceNames[res as ResourceType],
    type: res as ResourceType,
    count: count,
  })) as FormattedResource[];
}


export function getResourcesAsText(resources: Resources): string[] {
  return Object
    .entries(resources)
    .map(([resType, amount]) => `+${amount} ${resourceNames[resType as ResourceType]}`);
}

export function getResourcesAsJoinedText(resources: Resources): string {
  return getResourcesAsText(resources).join('\n')
}

