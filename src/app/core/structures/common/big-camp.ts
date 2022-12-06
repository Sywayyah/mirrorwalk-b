import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { NeutralRewardTypesEnum, ScriptedReward, StructureGeneratorModel, StuctureControl } from '../types';

export const BigCampStructure: StructureGeneratorModel = {
  name: 'Big Camp',
  generateGuard() {
    return {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [neutralsFraction.getUnitType('ForestTrolls'), 24, 26, 1],
        [neutralsFraction.getUnitType('Gnoll'), 28, 36, 1],
        [neutralsFraction.getUnitType('Thiefs'), 15, 18, 1],
      ],
    };
  },
  control: StuctureControl.Neutral,
  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.Scripted,
      description: 'Big camp is defeated! \n\n +450 Experience',
      onAccept({ playersApi }) {
        const currentPlayer = playersApi.getCurrentPlayer();

        playersApi.addExperienceToPlayer(currentPlayer, 450);
      },
    } as ScriptedReward;
  }
};
