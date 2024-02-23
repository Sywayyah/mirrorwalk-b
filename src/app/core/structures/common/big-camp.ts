import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { NeutralRewardTypesEnum, ScriptedReward, StructureGeneratorModel, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const BigCampStructure: StructureGeneratorModel = createStructure({
  id: '#struct-big-camp',
  name: 'Big Camp',
  actionPoints: 1,
  generateGuard() {
    return {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [neutralsFraction.getUnitType('ForestTrolls'), 23, 25, 1],
        [neutralsFraction.getUnitType('Gnoll'), 28, 36, 1],
        [neutralsFraction.getUnitType('Thieves'), 15, 18, 1],
      ],
    };
  },
  control: StuctureControl.Neutral,
  generateReward: () => {
    // return {
    //   type: NeutralRewardTypesEnum.NoReward,
    // }
    return {
      type: NeutralRewardTypesEnum.Scripted,
      description: 'Big camp is defeated! \n\n +450 Experience',
      onAccept({ playersApi }) {
        const currentPlayer = playersApi.getCurrentPlayer();

        playersApi.addExperienceToPlayer(currentPlayer, 450);
      },
    } as ScriptedReward;
  }
});
