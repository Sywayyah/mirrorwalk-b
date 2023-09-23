import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { GenerationModel } from '../../unit-types';
import { HiringReward, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl, UnitUpgradeReward } from '../types';

export const GraveyardStructure: StructureGeneratorModel = {
  name: 'Graveyard',
  control: StuctureControl.Neutral,

  generateGuard: () => {
    const guard = {
      maxUnitGroups: 2,
      minUnitGroups: 2,
      units: [
        [neutralsFraction.getUnitType('Ghosts'), 16, 24, 1],
        [neutralsFraction.getUnitType('Skeletons'), 16, 24, 1],
      ],
    } as GenerationModel;

    return guard;
  },

  generateReward: () => {
    const hiringReward: HiringReward = {
      type: NeutralRewardTypesEnum.UnitsHire,
      units: [
        { unitType: neutralsFraction.getUnitType('Ghosts'), maxCount: 24 },
      ],
    };

    return hiringReward;
  },
};

export const BeaconOfTheUndead: StructureGeneratorModel = {
  name: 'Beacon of the Undead',
  control: StuctureControl.Neutral,
  description: 'Allows to upgrade your ghost units below level 4.',

  /* todo: also, think about this. Maybe if we can have callbacks like this,
      then there is no need for 'onVisited'
   */
  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.UnitsUpgrade,
      getUnits: (playersApi) => {
        return playersApi
          .getCurrentPlayerUnitGroups()
          .filter(unitGroup => {
            const unitType = unitGroup.type;

            return !unitType.upgraded && unitType.level <= 4 && unitType.defaultModifiers?.isGhost;
          });
      },
    } as UnitUpgradeReward;
  },
};
