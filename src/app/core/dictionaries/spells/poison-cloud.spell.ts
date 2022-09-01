import { DamageType } from "../../model/combat-api/combat-api.types";
import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";
import { Colors } from "../colors.const";


export const PoisonCloudDebuff: SpellModel<undefined | { debuffRoundsLeft: number }> = {
    activationType: SpellActivationType.Debuff,
    name: 'Poisoned',
    icon: {
        icon: 'poison-cloud',
        bgClr: Colors.DefautlDebuffBg,
        iconClr: Colors.DefautlDebuffClr,
    },
    description: 'Poison deals 65 damage at the beginning of each round.',
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
    activationType: SpellActivationType.Target,
    icon: {
        icon: 'poison-cloud',
    },
    name: 'Poison Cloud',
    description: 'Poisons target, which takes damage at the beginning of each round. Lasts 2 rounds.',
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
