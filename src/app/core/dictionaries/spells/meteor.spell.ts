import { DamageType } from "../../model/combat-api/combat-api.types";
import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";

export const MeteorSpell: SpellModel = {
    activationType: SpellActivationType.Instant,
    name: 'Meteor',

    icon: {
        // iconClr: 'rgb(244 162 124)',

        icon: 'burning-meteor'
    },
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