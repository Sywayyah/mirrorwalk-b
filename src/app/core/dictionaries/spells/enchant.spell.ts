import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";


export const ENCHANT_DEBUFF: SpellModel = {
    name: 'Enchanted',
    activationType: SpellActivationType.Debuff,
    level: 1,
    icon: {
        icon: 'fire-ring',
    },
    description: 'Incoming magic damage is increased by 50%.',
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
                    amplifiedTakenMagicDamage: 0.5
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
    icon: {
        // iconClr: 'rgb(235 142 178)',
        icon: 'fire-ring',
    },
    activationType: SpellActivationType.Target,
    description: 'Enchants an enemy, increases incoming magic damage by 50%.',
    type: {
        spellInfo: {
            name: 'Enchant',
        },
        spellConfig: {
            targetCastConfig: {
                canActivate: ({ isEnemy, unitGroup }) => {
                    return isEnemy;
                }
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