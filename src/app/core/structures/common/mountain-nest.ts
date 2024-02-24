import { humansFaction } from '../../factions';
import { spellDescrElem } from '../../ui';
import { CommonUtils } from '../../utils';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const MountainNestStructure: StructureGeneratorModel = createStructure({
  id: '#struct-mountain-nest',

  control: StuctureControl.Neutral,
  actionPoints: 2,
  name: 'Mountain Nest',
  description: ({ thisStruct }) => {
    const descriptions = [
      spellDescrElem('Walking through mountains, you find a very bright birdnest... \n\n1-2 Firebirds join your army.'),
    ];

    if (thisStruct.controls?.accept === false) {
      descriptions.push(spellDescrElem(`You have no free slots.`));
    }

    return {
      descriptions,
    }
  },

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          players.addUnitGroupToPlayer(visitingPlayer, humansFaction.getUnitType('Firebird'), CommonUtils.randIntInRange(1, 2));

          thisStruct.visited = true;
        },

        StructInspected() {
          thisStruct.setControls({
            accept: players.getCurrentPlayer().hero.hasFreeUnitSlots(),
          });
        },
      });
    }
  },
});
