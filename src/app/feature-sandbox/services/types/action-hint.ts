import { SpellInstance, UnitGroupInstModel, UnitGroupModel } from "src/app/core/model";

export enum ActionHintTypeEnum {
    OnHoverEnemyCard = 'on-hover-enemy-card',
    OnTargetSpell = 'on-target-spell'
}

export interface ActionHintModel<T extends ActionHintTypeEnum = ActionHintTypeEnum> {
    type: T;
}

export interface AttackActionHintInfo extends ActionHintModel<ActionHintTypeEnum.OnHoverEnemyCard> {
    attackedGroup: UnitGroupModel;
    minDamage: number;
    maxDamage: number;
    minCountLoss: number;
    maxCountLoss: number;
    noDamageSpread: boolean;
    noLossSpread: boolean;
    attackSuperiority: number;
}

export interface SpellTargetActionHint extends ActionHintModel<ActionHintTypeEnum.OnTargetSpell> {
    spell: SpellInstance;
    target: UnitGroupInstModel;
}

