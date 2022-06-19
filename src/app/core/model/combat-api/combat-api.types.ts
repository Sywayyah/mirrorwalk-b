import type { PlayerInstanceModel, UnitGroupInstModel } from "../main.model";
import type { Modifiers } from "../modifiers";
import type { DefaultSpellStateType, SpellInstance, SpellModel } from "../spells";


export interface PostDamageInfo {
    unitLoss: number;
    finalDamage: number;
}

export enum DamageType {
    PhysicalAttack = 'physAttack',
    Physical = 'physical',
    Magic = 'magic',
}

export interface SpellCreationOptions<T = DefaultSpellStateType> {
    initialLevel?: number;
    state?: T;
}

export interface CombatActionsRef {
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
        spell: SpellInstance<T>,
        ownerPlayer: PlayerInstanceModel,
    ) => void;

    // Removes spell instance from the target unit group and from battle events system.
    removeSpellFromUnitGroup: <T = DefaultSpellStateType>(
        target: UnitGroupInstModel,
        spell: SpellInstance<T>,
    ) => void;

    getUnitGroupsOfPlayer: (player: PlayerInstanceModel) => UnitGroupInstModel[];

    getRandomEnemyPlayerGroup: () => UnitGroupInstModel;

    historyLog: (plainMsg: string) => void;

    createSpellInstance: <T>(spell: SpellModel<T>, options?: SpellCreationOptions<T>) => SpellInstance<T>;

    createModifiers: (modifiers: Modifiers) => Modifiers;

    addModifiersToUnitGroup: (target: UnitGroupInstModel, modifiers: Modifiers) => void;

    removeModifiresFromUnitGroup: (target: UnitGroupInstModel, modifiers: Modifiers) => void;
}