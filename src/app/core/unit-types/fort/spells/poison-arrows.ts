import { DamageType } from 'src/app/core/api/combat-api';
import { SpellActivationType, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';
import { messageWrapper } from 'src/app/core/vfx';

export const PoisonArrowsDebuff = createSpell<{ poisonDamage: number }>({
  name: 'Poisoned',
  icon: { icon: 'chemical-arrow', bgClr: 'green' },
  activationType: SpellActivationType.Passive,
  getDescription: ({ ownerUnit }) => ({
    descriptions: [
      spellDescrElem(`This group is poisoned, receiving poison damage.`),
    ]
  }),
  config: {
    spellConfig: {
      init({ events, actions, vfx, spellInstance }) {
        events.on({
          SpellPlacedOnUnitGroup({ target }) {
            vfx.createDroppingMessageForUnitGroup(target.id, { html: messageWrapper(`Poisoned!`) });
            // improve logic
            actions.dealDamageTo(target, spellInstance.state?.poisonDamage || 0, DamageType.Poison);
          }
        })
      },
    },
  },
});

export const PoisonArrowsSpell = createSpell({
  name: 'Poison Arrows',
  icon: { icon: 'chemical-arrow', },
  activationType: SpellActivationType.Passive,
  getDescription: ({ ownerUnit }) => ({
    descriptions: [
      spellDescrElem(`Poisons enemy on attack, dealing ${ownerUnit!.count * 2} poison damage (2 damage per unit).`),
    ]
  }),
  config: {
    spellConfig: {
      init({ events, actions, vfx, ownerUnit, ownerPlayer }) {
        events.on({
          UnitGroupAttacks({ attacker, attacked }) {
            if (attacker !== ownerUnit) {
              return;
            }
            const poisonDebuff = actions.createSpellInstance(PoisonArrowsDebuff);

            poisonDebuff.state = { poisonDamage: attacker.count * 2 };

            // prevent stacking
            if (attacked.spells.some(spell => spell.baseType === PoisonArrowsDebuff)) {
              return;
            }

            actions.addSpellToUnitGroup(attacked, poisonDebuff, ownerPlayer);
          },
        });
      },
    },
  },
});
