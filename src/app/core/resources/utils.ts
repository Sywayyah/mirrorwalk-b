import { hasProp } from '../utils/common';
import { Resources, ResourcesModel, ResourceType } from './types';

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

export function getFactoredResources(resources: Resources, factor: number): Resources {
  const newResources = { ...resources } as Resources;

  // handle differently for different resources
  for (const resType in newResources) {
    if (hasProp(newResources, resType)) {
      newResources[resType] = (newResources[resType] as number) + Math.ceil((newResources[resType] as number) * factor);
    }
  }

  return newResources;
}

export function getResourcesAsText(resources: Resources): string[] {
  return Object.entries(resources).map(
    ([resType, amount]) =>
      `+${amount} ${resourceNames[resType as ResourceType]}`,
  );
}

export function getResourcesAsJoinedText(resources: Resources): string {
  return getResourcesAsText(resources).join('\n');
}

export function addResources(
  resources: ResourcesModel,
  resourcesToAdd: Resources,
): ResourcesModel {
  Object.entries(resourcesToAdd).forEach(
    ([res, count]) => (resources[res as ResourceType] += count),
  );

  return resources;
}
