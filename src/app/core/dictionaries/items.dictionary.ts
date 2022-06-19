import { GameEventTypes, ItemBaseModel } from "../model/items/items.types";
import { WIND_BLESS_BUFF } from "./spells/wind-bless.spell";

export const ItemDoomstring: ItemBaseModel<{}> = {
    name: 'Doomstring',
    staticMods: {
        playerBonusAttack: 2,
    },
    icon: {
        icon: 'crossbow',
    },
    defaultState: {},
    description: () => '+2 to Attack.',
    config: {
        init: () => { },
    }
};

export const ItemWindCrest: ItemBaseModel = {
    name: 'Wind Crest',
    staticMods: {
        playerBonusAttack: 2,
    },
    icon: {
        icon: 'feather-wing',
    },
    config: {
        init: ({
            actions, events, ownerPlayer,
        }) => {
            events.on({
                [GameEventTypes.NewRoundBegins]: event => {
                    if (event.round === 0) {
                        actions.getUnitGroupsOfPlayer(ownerPlayer)
                            .filter(unitGroup => unitGroup.type.defaultModifiers?.isRanged)
                            .forEach(rangedUnitGroup => {
                                const windBlessBuff = actions.createSpellInstance(WIND_BLESS_BUFF);
                                actions.addSpellToUnitGroup(rangedUnitGroup, windBlessBuff, ownerPlayer);
                            });
                    }
                }
            })
        },
    },
    description: (item) => {
        return '+2 Attack. At the beginning of the fight, grants Wind Blessing (level 1) effect to your ranged units for 1 round.';
    },
}