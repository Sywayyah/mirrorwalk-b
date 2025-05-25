import { DamageType } from 'src/app/core/api/combat-api';
import { SpellActivationType, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';

const baseValue = 20;
const levelBonus = 10;

export const LifeDrainSpell = createSpell({
  id: '#spell-life-transfer',

  name: 'Life Drain',
  icon: { icon: 'health-decrease' },
  activationType: SpellActivationType.Instant,
  getDescription: ({ spellInstance }) => ({
    descriptions: [
      spellDescrElem(
        `Reallocates health from enemies, dealing ${baseValue + levelBonus * (spellInstance.currentLevel - 1)} damage to all enemies and equally distributing the dealt damage as healing among your army.`,
      ),
    ],
  }),
  config: {
    getManaCost: () => 3,
    init({ events, actions, vfx, ownerPlayer, spellInstance }) {
      events.on({
        PlayerCastsInstantSpell() {
          const enemyPlayer = actions.getEnemyOfPlayer(ownerPlayer);
          const aliveEnemies = actions.getAliveUnitGroupsOfPlayer(enemyPlayer);

          const damage = baseValue + levelBonus * (spellInstance.currentLevel - 1);
          const initialEnemyCount = aliveEnemies.length;
          aliveEnemies.forEach((enemy) => {
            actions.dealDamageTo(enemy, damage, DamageType.Magic);
          });

          const totalHeal = initialEnemyCount * damage;
          const currentArmy = actions.getUnitGroupsOfPlayer(ownerPlayer);

          const healPerUnit = Math.round(totalHeal / currentArmy.length);

          currentArmy.forEach((unit) => actions.healUnit(unit, healPerUnit));
        },
      });
    },
  },
});
