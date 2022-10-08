import { NeutralRewardTypesEnum, ScriptedReward, StructureGeneratorModel, StuctureControl } from "../../model/structures.types";
import { NEUTRAL_FRACTION_UNIT_TYPES } from "../unit-types/neutral-unit-types.dictionary";

export const BigCampStructure: StructureGeneratorModel = {
  name: 'Big Camp',
  generateGuard() {
    return {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [NEUTRAL_FRACTION_UNIT_TYPES.ForestTrolls, 24, 26, 1],
        [NEUTRAL_FRACTION_UNIT_TYPES.Gnolls, 28, 36, 1],
        [NEUTRAL_FRACTION_UNIT_TYPES.Thiefs, 15, 18, 1],
      ],
    };
  },
  control: StuctureControl.Neutral,
  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.Scripted,
      description: 'Big camp is defeated! \n\n +450 Experience',
      onAccept({playersApi}) {
        const currentPlayer = playersApi.getCurrentPlayer();

        playersApi.addExperienceToPlayer(currentPlayer, 450);
      },
    } as ScriptedReward;
  }
};
