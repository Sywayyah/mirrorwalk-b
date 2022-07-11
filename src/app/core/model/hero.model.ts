import { GenerationModel } from "../utils/common.utils";
import { ItemBaseModel, ItemInstanceModel } from "./items/items.types";
import { HeroInstanceStats } from "./main.model";
import { Modifiers } from "./modifiers";
import { ResourcesModel } from "./resources.types";
import { SpellInstance, SpellModel } from "./spells/spell.types";

export interface HeroModelStats {
    stats: {
        mana: number;
        baseAttack: number;
    };
    abilities: SpellModel[];
    resources: ResourcesModel;
    items: ItemBaseModel[];
    army: GenerationModel[];
}

export interface HeroModel {
    name: string;
    initialState: {
        stats: {
            mana: number;
            baseAttack: number;
        },
        abilities: SpellModel[],
        resources: ResourcesModel,
        items: ItemBaseModel[],
        army: GenerationModel[],
    };
}

/* Hero model, instance more likely */

export interface HeroInstanceModel {
    name: string | null;
    experience: number;
    level: number;
    freeSkillpoints: number;
    stats: HeroInstanceStats;
    // abilities?: AbilityTypeModel[];
    spells: SpellInstance[];
    mods: Modifiers[];
    items: ItemInstanceModel[];
    base: HeroModel;
}
