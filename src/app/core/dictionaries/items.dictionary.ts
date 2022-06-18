import { GameEventTypes, ItemBaseModel } from "../model/items/items.types";
import { WIND_BLESS_BUFF } from "./spells/wind-bless.spell";

export const ItemDoomstring: ItemBaseModel<{}> = {
    name: 'Doomstring',
    staticMods: {
        // playerBonusAttack: 2,
    },
    defaultState: {},
    description: () => '',
    config: {
        init: () => { },
    }
};

export const ItemWindCrest: ItemBaseModel = {
    name: 'Wind Crest',
    staticMods: {
        playerBonusAttack: 2,
    },
    config: {
        init: ({
            actions, events, ownerPlayer,
        }) => {
            events.on({
                [GameEventTypes.NewRoundBegins]: event => {
                    if (event.round === 0) {
                        actions.getUnitGroupsOfPlayer(ownerPlayer)
                            .filter(unitGroup => unitGroup.type.defaultMods?.isRanged)
                            .forEach(rangedUnitGroup => {
                                const windBlessBuff = actions.createSpellInstance(WIND_BLESS_BUFF);
                                actions.addSpellToUnitGroup(rangedUnitGroup, windBlessBuff, ownerPlayer);
                            })
                    }
                }
            })
        },
    },
    description: (item) => {
        return 'At the beginning of the round, grands Wind Blessing (level 1) to your ranged units for 1 round. Grants +1 to attack to your hero.';
    },
}