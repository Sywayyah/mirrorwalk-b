import { Resources, joinedResourcesText } from '../../resources';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';

export const lockLocation = (config: { icon: string; actionPoints?: number; name: string; descr: string; resources: Resources }): StructureGeneratorModel => {
  const location: StructureGeneratorModel = {
    control: StuctureControl.Neutral,
    actionPoints: config.actionPoints ?? 1,
    name: config.name,
    type: StructureType.Scripted,
    icon: config.icon,
    description: () => ({
      descriptions: [config.descr, '\nRequired Resources:', joinedResourcesText(config.resources)],
    }),
    config: {
      init({ localEvents, players, thisStruct, structures }) {
        localEvents.on({
          StructInspected() {
            thisStruct.controls = {
              accept: players.playerHasResources(players.getCurrentPlayer(), config.resources),
            };
          },
          StructVisited({ visitingPlayer }) {
            players.removeResourcesFromPlayer(visitingPlayer, config.resources);

            structures.markLocationVisited(thisStruct);
          }
        });
      }
    },
  };

  return location;
};

export const SettlementLocation: StructureGeneratorModel = lockLocation({
  descr: 'A ravaged settlement. Rebuilding it will let you access some related locations.',
  icon: 'locked-fortress',
  name: 'Settlement',
  resources: {
    gold: 1000,
    wood: 1,
  }
});
