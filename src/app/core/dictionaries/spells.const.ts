import { DamageType, SpellActivationType, SpellEventTypes, SpellModel } from "../model/main.model";

/* try different types of spells. also, try applying buffs. */
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

export const POISON_CLOUD_SPELL_EFFECT: SpellModel = {
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
                        actions.historyLog(`${target.type.name} gets negative effect "${thisSpell.name}"`);
                        events.on({
                            [SpellEventTypes.NewRoundBegins]: (event) => {
                                actions.historyLog(`Poison deals ${65} damage to ${target.type.name}`);

                                actions.dealDamageTo(target, 65, DamageType.Magic);
                            }
                        });

                    }
                });
            }
        }
    }
};

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