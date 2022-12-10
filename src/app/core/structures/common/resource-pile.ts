import { ResourceType } from '../../resources';
import { StructureGeneratorModel, StuctureControl } from '../types';

const pilesOf: Record<ResourceType, string> = {
  [ResourceType.Gems]: 'Gems',
  [ResourceType.Gold]: 'Gold',
  [ResourceType.RedCrystals]: 'Red Crystals',
  [ResourceType.Wood]: 'Wood',
};

export const resPileStructure = (
  resType: ResourceType,
  amount: number,
): StructureGeneratorModel => {

  return {
    name: 'Pile of ' + pilesOf[resType],
    control: StuctureControl.Neutral,
    description: `You found a pile of resources \n\n +${amount} ${pilesOf[resType]}`,

    onVisited: ({ playersApi, visitingPlayer }) => {
      playersApi.addResourcesToPlayer(
        visitingPlayer,
        resType,
        amount,
      );
    },
  };
};
