import { DamageType, SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";

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