import { CombatActionsRef } from "../combat-api/combat-api.types";
import type { HeroModel, PlayerInstanceModel, UnitGroupInstModel } from "../main.model";
import type { SpellEventHandlers } from "./spell-events";

export enum SpellActivationType {
    Target = 'target',
    Instant = 'instant',
    Passive = 'passive',

    //  special type of ability, can be added to the unit group for some
    // continuous effect. When unit group dies, debuff gets removed and unregistered. 
    Debuff = 'debuff',
    Buff = 'buff',
}

/* Spell model */

export type DefaultSpellStateType = unknown;

export interface SpellModel<SpellStateType = DefaultSpellStateType> {
    name: string;
    level: number;
    activationType: SpellActivationType;

    description?: string;

    type: SpellTypeModel<SpellStateType>;
}

export interface SpellInstance<T = DefaultSpellStateType> {
    name: string;
    description: string;

    state: T | null;
    currentLevel: number;
    currentManaCost: number;
    // cooldown: number;


    baseType: SpellModel<T>;
}

export interface SpellTypeModel<SpellStateType> {
    spellConfig: SpellConfig<SpellStateType>;
    spellInfo: { name: string; };
}

export interface SpellCombatEventsRef {
    on: (handlers: SpellEventHandlers) => void;
}

export interface SpellCombatRefsModel<SpellStateType> {
    events: SpellCombatEventsRef;
    actions: CombatActionsRef;
    thisSpell: SpellModel<SpellStateType>;
    spellInstance: SpellInstance<SpellStateType>;
    ownerPlayer: PlayerInstanceModel;
    ownerHero: HeroModel;
}

export interface SpellConfig<SpellStateType> {
    init: (combatRefs: SpellCombatRefsModel<SpellStateType>) => void;
    getManaCost: (spellInst: SpellInstance<SpellStateType>) => number;
    targetCastConfig?: {
        canActivate?: (info: {
            unitGroup: UnitGroupInstModel,
            isEnemy: boolean,
        }) => boolean,
    };
}

