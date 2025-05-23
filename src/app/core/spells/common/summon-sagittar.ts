import { spellDescrElem } from '../../ui';
import { simpleConvergentBuffAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { createSpell } from '../utils';

const unitCount = 6;
const unitsPerLevel = 4;

export const SummonSagittarSpell: SpellBaseType = createSpell({
  id: '#spell-summon-sagittar',

  name: 'Summon Sagittar',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'arrow-cluster',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Summons ${unitCount + data.ownerHero.level * unitsPerLevel} Sagittars that fight on your side.`),
      ],
    }
  },
  config: {
    spellConfig: {
      getManaCost() { return 2; },
      init({ actions, ownerHero, ownerPlayer, events, vfx, thisSpell }) {
        events.on({
          PlayerCastsInstantSpell() {
            const summonedUnitGroup = actions.summonUnitsForPlayer(ownerPlayer, '#unit-c20', unitCount + ownerHero.level * unitsPerLevel);

            vfx.createEffectForUnitGroup(summonedUnitGroup, simpleConvergentBuffAnimation('arrow-cluster', 'rgb(190, 190, 231)'), { duration: 1000 });
          },
        })
      },
    },
  }
});
