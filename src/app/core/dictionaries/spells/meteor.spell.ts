import { DamageType, SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";

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
                    1: 7,
                    2: 8,
                    3: 9,
                    4: 10,
                };

                return manaCosts[spell.currentLevel];
            },

            init({ events, actions, thisSpell, ownerHero }) {
                events.on({
                    [SpellEventTypes.PlayerCastsInstantSpell]: event => {
                        const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();
                        actions.dealDamageTo(
                            randomEnemyGroup,
                            160,
                            DamageType.Magic,
                            ({ unitLoss, finalDamage }) => {
                                actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${randomEnemyGroup.count} ${randomEnemyGroup.type.name} with ${thisSpell.name}, ${unitLoss} units perish`);

                            });
                    },
                });
            },
        }
    }
}