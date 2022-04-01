
/* 
    I'm uncertain of what items model should consist of.
    Because of that, I feel like I need arrays.

    Anyways, it's not thought through completely.
        It will most surely require implementing new systems.

    Especially for active abilities.

    Also probably need to figure out more clearly the 
        stats of the units, and which systems I want to have
        for them

    Idea, Item: If army has unit of level 9, all gain bonus

    Important: I think, it makes more sense for now to make 
        gameplay and main stats more interesting

*/

import { UnitGroupModel } from "../model/main.model";

export interface ItemRequirementModel {
    type: string;
    value?: number | string | boolean;
    isRequirementMet?: (item: ItemModel, unitGroup: UnitGroupModel) => boolean;
}

export interface ItemStatsModel {
    type: string;
    value?: number | string | boolean;
    modifierFn?: (unitGroup?: UnitGroupModel) => void;
}


export interface ItemModel {
    name: string;
    /* Item can have reqs I think */
    requirements: ItemRequirementModel[],
    /* As well as modifiers */
    modifiers: ItemStatsModel[];
    /* And description can be built like this */
    description: (item: ItemModel) => object[];
    
    /* Item class? */
    /* Active abilities? This will require an entire system */
}

export const ItemDoomstring: ItemModel = {
    name: 'Doomstring',
    requirements: [
        // { type: }
    ],
    modifiers: [],
    description: () => [],
};