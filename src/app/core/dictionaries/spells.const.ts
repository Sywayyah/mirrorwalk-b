import { DamageType, SpellActivationType, SpellEventTypes, SpellModel } from "../model/spells";

/* try different types of spells. also, try applying buffs. */
/* note: SpellModel, mainly, gets spreaded into a new object, since each buff may have something own */
export const RAIN_OF_FIRE_SPELL: SpellModel = {
    name: 'Rain of Fire',
    level: 1,
    activationType: SpellActivationType.Target,
    description: 'Deals average damage to the target',
    type: {
        spellInfo: {
            name: 'Rain of Fire',
        },
        spellConfig: {
            init: ({ events, actions, thisSpell, ownerHero }) => {

                events.on({
                    [SpellEventTypes.PlayerTargetsSpell]: (event) => {
                        const damage = 65 * ownerHero.level;

                        actions.dealDamageTo(
                            event.target,
                            damage,
                            DamageType.Magic,
                            (actionInfo) => {
                                actions.historyLog(`${ownerHero.name} deals ${actionInfo.finalDamage} damage to ${event.target.type.name} with ${thisSpell.name}`)
                            },
                        );
                    }
                });

            },
            getManaCost: (spell) => {
                const manaCosts: Record<number, number> = {
                    1: 2,
                    2: 2,
                    3: 3,
                    4: 3,
                };

                return manaCosts[spell.currentLevel];
            },
        },
    }
};

export const POISON_CLOUD_SPELL_EFFECT: SpellModel<undefined | { debuffRoundsLeft: number }> = {
    activationType: SpellActivationType.Debuff,
    level: 1,
    name: 'Poisoned',
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

export const METEOR_SPELL: SpellModel = {
    activationType: SpellActivationType.Instant,
    level: 1,
    name: 'Meteor',

    description: 'Deals medium damage to random enemy group',

    type: {
        spellInfo: {
            name: 'Meteor',
        },
        spellConfig: {
            getManaCost: (spell) => {
                const manaCosts: Record<number, number> = {
                    1: 4,
                    2: 4,
                    3: 5,
                    4: 5,
                };

                return manaCosts[spell.currentLevel];
            },

            init({ events, actions, thisSpell, ownerHero }) {
                events.on({
                    [SpellEventTypes.PlayerCastsInstantSpell]: event => {
                        const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();
                        actions.dealDamageTo(
                            randomEnemyGroup,
                            70,
                            DamageType.Magic,
                            ({ unitLoss, finalDamage }) => {
                                actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${randomEnemyGroup.count} ${randomEnemyGroup.type.name} with ${thisSpell.name}, ${unitLoss} units perish`);

                            });
                    }
                })
            }
        }
    }
}

export const POISON_CLOUD_SPELL: SpellModel = {
    activationType: SpellActivationType.Target,
    level: 1,
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

                        const poisonDebuffInstance = actions.createSpellInstance(POISON_CLOUD_SPELL_EFFECT);

                        actions.addSpellToUnitGroup(event.target, poisonDebuffInstance, ownerPlayer);
                    }
                });
            }
        }
    }
};

export const BLINDNESS_SPELL: SpellModel = {
    name: 'Blindness',
    level: 1,
    activationType: SpellActivationType.Instant,
    type: {
        spellInfo: {
            name: 'blindness',
        },
        spellConfig: {
            getManaCost(spellInst) {
                return 0;
            },

            init: () => { },
        },
    }
};


export const ENCHANT_DEBUFF: SpellModel = {
    name: 'Enchanted',
    activationType: SpellActivationType.Debuff,
    level: 1,
    type: {
        spellInfo: {
            name: 'Enchanted',
        },
        spellConfig: {
            getManaCost(spellInst) {
                return 0;
            },

            init: ({ events, actions }) => {
                const mods = actions.createModifiers({
                    amplifiedTakenMagicDamage: 0.12
                });

                events.on({
                    [SpellEventTypes.SpellPlacedOnUnitGroup]: (event) => {
                        actions.addModifiersToUnitGroup(event.target, mods);
                    },
                })
            }
        }
    },
};

export const ENCHANT_SPELL: SpellModel = {
    name: 'Enchant',
    level: 1,
    activationType: SpellActivationType.Target,
    description: 'Enchants an enemy, increases incoming magic damage.',
    type: {
        spellInfo: {
            name: 'Enchant',
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

            init: ({ events, actions, ownerPlayer }) => {
                events.on({
                    [SpellEventTypes.PlayerTargetsSpell]: (event) => {
                        const enchantDebuff = actions.createSpellInstance(ENCHANT_DEBUFF);
                        actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
                        actions.historyLog('Enemy is enchanted');
                    },
                });
            },
        },
    },
};