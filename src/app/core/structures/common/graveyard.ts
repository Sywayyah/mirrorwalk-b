import { GenerationModel } from '../../unit-types';
import { HiringReward, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl, UnitUpgradeReward } from '../types';
import { createStructure } from '../utils';

export const GraveyardStructure: StructureGeneratorModel = createStructure({
  id: '#struct-graveyard',
  name: 'Graveyard',
  actionPoints: 1,
  control: StuctureControl.Neutral,

  generateGuard: () => {
    const guard = {
      maxUnitGroups: 2,
      minUnitGroups: 3,
      units: [
        ['#unit-neut-ghost-0', 14, 18, 3],
      ],
    } as GenerationModel;

    return guard;
  },

  generateReward: () => {
    const hiringReward: HiringReward = {
      type: NeutralRewardTypesEnum.UnitsHire,
      units: [
        { unitTypeId: '#unit-neut-ghost-0', maxCount: 24 },
      ],
    };

    return hiringReward;
  },
});

export const BeaconOfTheUndead: StructureGeneratorModel = createStructure({
  id: '#struct-undead-beacon',

  name: 'Beacon of the Undead',
  control: StuctureControl.Neutral,
  description: () => ({
    descriptions: [
      'Allows to upgrade your ghost units below level 4.',
    ]
  }),

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
});
