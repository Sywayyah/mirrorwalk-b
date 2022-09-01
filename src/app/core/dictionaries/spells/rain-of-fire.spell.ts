import { FireAnimation } from "src/app/core/dictionaries/vfx/animations";
import { DamageType } from "../../model/combat-api/combat-api.types";
import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";
import { canActivateOnEnemyFn } from "./utils";

export const RainOfFireSpell: SpellModel = {
    name: 'Rain of Fire',
    icon: {
        // iconClr: 'rgb(244 162 124)',

        icon: 'fire',
    },
    activationType: SpellActivationType.Target,
    description: 'Deals average damage to the target',
    type: {
        spellInfo: {
            name: 'Rain of Fire',
        },
        spellConfig: {
            targetCastConfig: {
                canActivate: canActivateOnEnemyFn,
            },
            init: ({ events, actions, thisSpell, ownerHero, vfx }) => {

                events.on({
                    [SpellEventTypes.PlayerTargetsSpell]: (event) => {

                        vfx.createEffectForUnitGroup(event.target, FireAnimation, {
                            duration: 850,
                        });


                        const damage = 65 * ownerHero.level;

                        actions.dealDamageTo(
                            event.target,
                            damage,
                            DamageType.Magic,
                            (actionInfo) => {
                                actions.historyLog(`${ownerHero.name} deals ${actionInfo.finalDamage} damage to ${event.target.type.name} with ${thisSpell.name}`)

                                vfx.createFloatingMessageForUnitGroup(event.target, {
                                    parts: [
                                        { type: 'plainPart', icon: 'sword', text: actionInfo.finalDamage, color: 'red' },
                                        { type: 'plainPart', icon: 'skull', text: actionInfo.unitLoss, color: 'white' },
                                    ],
                                }, { duration: 1000 })
                            },
                        );
                    }
                });

            },
            getManaCost: (spell) => {
                const baseMana = 3;

                const manaCosts: Record<number, number> = {
                    1: baseMana,
                    2: baseMana + 1,
                    3: baseMana + 1,
                    4: baseMana + 2,
                };

                return manaCosts[spell.currentLevel];
            },
        },
    }
};