import { StructId } from '../../entities';
import { Resources, joinedResourcesText } from '../../resources';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const lockLocation = (config: { id: StructId, icon: string; actionPoints?: number; name: string; descr: string; resources: Resources }): StructureGeneratorModel => {
  const location: StructureGeneratorModel = createStructure({
    id: config.id,
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
  });

  return location;
};

export const SettlementLocation: StructureGeneratorModel = lockLocation({
  id: '#struct-settlement',
  descr: 'A ravaged settlement. Rebuilding it will let you access some related locations.',
  icon: 'locked-fortress',
  name: 'Settlement',
  resources: {
    gold: 1000,
    wood: 1,
  }
});
