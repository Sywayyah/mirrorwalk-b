import { DamageType, SpellActivationType, SpellEventTypes, SpellModel } from "../model/main.model";

/* try different types of spells. also, try applying buffs. */
/* note: SpellModel, mainly, gets spreaded into a new object, since each buff may have something own */
export const RAIN_OF_FIRE_SPELL: SpellModel = {
    name: 'Rain of Fire',
    level: 1,
    activationType: SpellActivationType.Target,
    type: {
        spellInfo: {
            name: 'Rain of Fire',
        },
        spellConfig: {
            init: ({ events, actions, thisSpell, ownerHero }) => {

                events.on({
                    [SpellEventTypes.PlayerTargetsSpell]: (event) => {
                        const damage = 65 * ownerHero.level;

                        actions.historyLog(`${ownerHero.name} deals ${damage} damage to ${event.target.type.name} with ${thisSpell.name}`)
                        actions.dealDamageTo(event.target, damage, DamageType.Magic);
                    }
                });

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
            init({ events, actions, thisSpell }) {
                events.on({
                    [SpellEventTypes.SpellPlacedOnUnitGroup]: ({ target }) => {
                        const debuffData = {
                            debuffRoundsLeft: 2,
                        };

                        thisSpell.instanceData = debuffData;

                        actions.historyLog(`${target.type.name} gets negative effect "${thisSpell.name}"`);

                        events.on({
                            [SpellEventTypes.NewRoundBegins]: (event) => {

                                actions.dealDamageTo(target, 65, DamageType.Magic, (damageInfo) => {
                                    actions.historyLog(`Poison deals ${damageInfo.finalDamage} damage to ${target.type.name}, ${damageInfo.unitLoss} units perish`);
                                });

                                debuffData.debuffRoundsLeft--;

                                if (!debuffData.debuffRoundsLeft) {
                                    actions.removeSpellFromUnitGroup(target, thisSpell);
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
    type: {
        spellInfo: {
            name: 'Meteor',
        },
        spellConfig: {
            init({ events, actions, thisSpell, ownerHero }) {
                events.on({
                    [SpellEventTypes.PlayerCastsInstantSpell]: event => {
                        const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();
                        actions.dealDamageTo(
                            randomEnemyGroup,
                            70,
                            DamageType.Magic,
                            ({ unitLoss }) => {
                                actions.historyLog(`${ownerHero.name} deals ${70} damage to ${randomEnemyGroup.count} ${randomEnemyGroup.type.name} with ${thisSpell.name}, ${unitLoss} units perish`);

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
    type: {
        spellInfo: {
            name: 'Poison Cloud',
        },
        spellConfig: {
            init({ events, actions, ownerPlayer, ownerHero, thisSpell }) {
                events.on({
                    [SpellEventTypes.PlayerTargetsSpell]: event => {
                        actions.historyLog(`${ownerHero.name} applies "${thisSpell.name}" against ${event.target.type.name}`);
                        actions.addSpellToUnitGroup(event.target, POISON_CLOUD_SPELL_EFFECT, ownerPlayer);
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
            init: () => { },
        },
    }
};

export const ENCHANT_SPELL: SpellModel = {
    name: 'Enchant',
    level: 1,
    activationType: SpellActivationType.Passive,
    type: {
        spellInfo: {
            name: 'enchant',
        },
        spellConfig: {
            init: () => { },
        },
    },
};