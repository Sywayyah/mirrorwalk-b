import { constellationFraction } from '../../fractions/constellation/fraction';
import { spellDescrElem } from '../../ui';
import { FireAnimation } from '../../vfx';
import { SpellActivationType, SpellModel } from '../types';

const unitCount = 4;

export const SummonSagittarSpell: SpellModel = {
  name: 'Summon Sagittar',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'sagittarius',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Summons ${unitCount} Sagittars that fight on your side.`),
      ],
    }
  },
  type: {
    spellConfig: {
      getManaCost() { return 2; },
      init({ actions, ownerHero, ownerPlayer, events, vfx, thisSpell }) {
        events.on({
          PlayerCastsInstantSpell() {
            const summonedUnitGroup = actions.summonUnitsForPlayer(ownerPlayer, constellationFraction.getUnitType('Sagittar'), unitCount);

            vfx.createEffectForUnitGroup(summonedUnitGroup, FireAnimation, { duration: 1000 });
          },
        })
      },
    },
    spellInfo: {
      name: 'Summon Sagittar',
    }
  }
};
