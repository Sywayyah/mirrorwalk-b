import { Modifiers } from '../../modifiers';
import { spellDescrElem } from '../../ui';
import { frontStackingBuffAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, createSpell, debuffColors } from '../utils';

const slowingPercent = 50;
const spellIcon = 'player-despair';

const KneelingLightAnimation = frontStackingBuffAnimation(
  '#vfx-kneeling-light',
  'player-despair',
  'rgb(227, 240, 113)',
);
export const KneelingLightDebuff: SpellBaseType = createSpell({
  id: '#spell-kneeling-light-debuff',
  name: 'Slowed',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: spellIcon,
    ...debuffColors,
  },
  getDescription(data) {
    return {
      descriptions: [spellDescrElem(`Unit group is slowed down by ${slowingPercent}%.`)],
    };
  },
  config: {
    init: ({ events, actions, vfx }) => {
      events.on({
        SpellPlacedOnUnitGroup(event) {
          const targetSpeed = event.target.type.baseStats.speed;

          const mods: Modifiers = actions.createModifiers({
            unitGroupSpeedBonus: -(targetSpeed * (slowingPercent / 100)),
          });

          vfx.createEffectForUnitGroup(event.target, KneelingLightAnimation, {
            duration: 1000,
          });
          actions.addModifiersToUnitGroup(event.target, mods);
        },
      });
    },
  },
});

export const KneelingLight: SpellBaseType = createSpell({
  id: '#spell-kneeling-light',
  name: 'Kneeling Light',
  icon: {
    // iconClr: 'rgb(235 142 178)',
    icon: spellIcon,
  },

  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Makes light so heavy for the enemy target that it loses ${slowingPercent}% of the speed.`),
      ],
    };
  },
  activationType: SpellActivationType.Target,
  config: {
    targetCastConfig: {
      canActivate: canActivateOnEnemyFn,
    },
    getManaCost(spellInst) {
      const manaCosts: Record<number, number> = {
        1: 2,
        2: 2,
        3: 3,
        4: 3,
      };

      return manaCosts[spellInst.currentLevel];
    },

    init: ({ events, actions, ownerPlayer }) => {
      events.on({
        PlayerTargetsSpell(event) {
          const enchantDebuff = actions.createSpellInstance(KneelingLightDebuff);
          actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
        },
      });
    },
  },
});
