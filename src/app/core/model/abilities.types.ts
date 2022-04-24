
export enum AbilityTypesEnum {
    BaseCounterAttack,
}

export interface AbilityModel<T extends AbilityTypesEnum = AbilityTypesEnum> {
    type: T;
}

type Ability<T extends AbilityTypesEnum> = AbilityModel<T>;

export interface CounterAttackAbility extends Ability<AbilityTypesEnum.BaseCounterAttack> {}

