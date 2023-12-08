import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { LightningAnimation } from '../../vfx';
import { SpellActivationType } from '../types';
import { createSpell } from '../utils';

export const ChargedStrikeSpell = createSpell({
  name: 'Charged Strike',
  activationType: SpellActivationType.Target,
  icon: { icon: 'lightning' },
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Makes current unit group attack enemy with additional lightning damage.`),
      spellDescrElem(`If current unit group is cavalry type, damage is doubled, as well as critical damage is added`),
      spellDescrElem(`Consumes Turn.`)
    ]
  }),

  config: {
    spellConfig: {
      init({ actions, events, vfx }) {

        events.on({
          PlayerTargetsSpell({ target }) {
            const currentUnitGroup = actions.getCurrentUnitGroup();

            const isCavalry = currentUnitGroup.modGroup.getModValue('isCavalry') as boolean;

            const mods = actions.createModifiers({ criticalDamageMul: isCavalry ? 0.2 : 0.35, criticalDamageChance: 1 });
            actions.addModifiersToUnitGroup(currentUnitGroup, mods);

            actions.dealDamageTo(target, 40, DamageType.Lightning);

            vfx.createEffectForUnitGroup(target, LightningAnimation);

            actions.unitGroupAttack(currentUnitGroup, target);
            actions.removeModifiresFromUnitGroup(currentUnitGroup, mods);
          }
        });

      },
      getManaCost() { return 2; }
    }
  },
});
