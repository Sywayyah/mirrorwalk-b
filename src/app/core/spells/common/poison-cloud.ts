import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { SpellEventTypes } from '../spell-events';
import { SpellActivationType, SpellModel } from '../types';
import { debuffColors } from '../utils';

const intervalDamage = 65;

export const PoisonCloudDebuff: SpellModel<undefined | { debuffRoundsLeft: number }> = {
  name: 'Poisoned',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'poison-cloud',
    ...debuffColors,
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Poison deals ${intervalDamage} damage at the beginning of each round.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Poisoned'
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },
      init({ events, actions, thisSpell, spellInstance }) {
        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: ({ target }) => {
            const debuffData = {
              debuffRoundsLeft: 2,
            };

            spellInstance.state = debuffData;


            actions.historyLog(`${target.type.name} gets negative effect "${thisSpell.name}"`);

            events.on({
              [SpellEventTypes.NewRoundBegins]: (event) => {

                actions.dealDamageTo(target, 65, DamageType.Magic, (damageInfo) => {
                  actions.historyLog(`Poison deals ${damageInfo.finalDamage} damage to ${target.type.name}, ${damageInfo.unitLoss} units perish`);
                });

                debuffData.debuffRoundsLeft--;

                if (!debuffData.debuffRoundsLeft) {
                  actions.removeSpellFromUnitGroup(target, spellInstance);
                }
              }
            });

          }
        });
      }
    }
  }
};

export const PoisonCloudSpell: SpellModel = {
  name: 'Poison Cloud',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'poison-cloud',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Poisons target, which takes ${intervalDamage} damage at the beginning of each round. Lasts 2 rounds.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Poison Cloud',
    },
    spellConfig: {
      getManaCost(spellInst) {
        const manaCosts: Record<number, number> = {
          1: 2,
          2: 2,
          3: 3,
          4: 3,
        };

        return manaCosts[spellInst.currentLevel];
      },

      init({ events, actions, ownerPlayer, ownerHero, thisSpell }) {
        events.on({
          [SpellEventTypes.PlayerTargetsSpell]: event => {
            actions.historyLog(`${ownerHero.name} applies "${thisSpell.name}" against ${event.target.type.name}`);

            const poisonDebuffInstance = actions.createSpellInstance(PoisonCloudDebuff);

            actions.addSpellToUnitGroup(event.target, poisonDebuffInstance, ownerPlayer);
          }
        });
      }
    }
  }
};
