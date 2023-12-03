import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from '../types';

export const RockyPassageStructure: StructureGeneratorModel = {
  name: 'Rocky Passage',
  actionPoints: 2,

  description: () => ({ descriptions: ['A rocky passage held by a powerful dragon.'] }),
  disableWeeklyGuardRise: true,

  generateGuard() {
    return {
      minUnitGroups: 1,
      maxUnitGroups: 1,
      // guard of rocky passage may vary depending on random.
      //  There can be an ice or poison dragon occasionally, or some other guard.
      //  This location might also get reinforcements after some time passing on
      //  for instance, on day 10, if not defeated, Ice dragon might join,
      //  or 4 lesser fire dragons.

      // Could be another interesting mechanic, if player isn't going to
      //  defeat this camp by day 14, he will be automatically forced to fight them.
      units: [
        [neutralsFraction.getUnitType('Devastator'), 1, 1, 1],
      ],
    };
  },
  control: StuctureControl.Neutral,
  // may come up with some reward
  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.NoReward,
    };
  }
};
