import type { PlayerInstanceModel, UnitGroupInstModel } from "../main.model";
import type { DefaultSpellStateType, SpellModel } from "./spell.types";

export enum SpellEventTypes {
    PlayerTargetsSpell,
    PlayerCastsInstantSpell,
    SpellPlacedOnUnitGroup,
    NewRoundBegins,
}

export interface TargetSelected {
    target: UnitGroupInstModel;
}

export interface NewRoundBegins {
    round: number;
}

export interface SpellEventsMapping {
    [SpellEventTypes.PlayerTargetsSpell]: TargetSelected;
    [SpellEventTypes.SpellPlacedOnUnitGroup]: TargetSelected;
    [SpellEventTypes.NewRoundBegins]: NewRoundBegins;
    [SpellEventTypes.PlayerCastsInstantSpell]: { player: PlayerInstanceModel, spell: SpellModel };
}

export type SpellEventHandlers = { [K in keyof SpellEventsMapping]?: (target: SpellEventsMapping[K]) => void };


export interface PostDamageInfo {
    unitLoss: number;
    finalDamage: number;
}

export enum DamageType {
    PhysicalAttack = 'physAttack',
    Physical = 'physical',
    Magic = 'magic',
}

export interface SpellCombatActionsRef {
    dealDamageTo: (
        target: UnitGroupInstModel,
        damage: number,
        damageType: DamageType,
        postActionFn?: (actionInfo: PostDamageInfo) => void,
    ) => void;

    // Creates shallow clone of spell that is passed, registers it inside battle events system
    //  adds it to the target group and returning the reference of the created spell.
    addSpellToUnitGroup: <T = DefaultSpellStateType>(
        target: UnitGroupInstModel,
        spell: SpellModel<T>,
        ownerPlayer: PlayerInstanceModel,
    ) => SpellModel<T>;

    // Removes spell instance from the target unit group and from battle events system.
    removeSpellFromUnitGroup: <T = DefaultSpellStateType>(
        target: UnitGroupInstModel,
        spell: SpellModel<T>,
    ) => void;

    getRandomEnemyPlayerGroup: () => UnitGroupInstModel;

    historyLog: (plainMsg: string) => void;
}
