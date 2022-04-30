import { UnitGroupModel } from "src/app/core/model/main.model";

export enum ActionHintTypeEnum {
    OnHoverEnemyCard = 'on-hover-enemy-card'
}

export interface ActionHintModel<T extends ActionHintTypeEnum = ActionHintTypeEnum> {
    type: T;
}

export interface AttackActionHint extends ActionHintModel<ActionHintTypeEnum.OnHoverEnemyCard> {
    attackedGroup: UnitGroupModel;
    minDamage: number;
    maxDamage: number;
    minCountLoss: number;
    maxCountLoss: number;
    noDamageSpread: boolean;
    noLossSpread: boolean;
    attackSuperiority: number;
}

