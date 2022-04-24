
export enum AbilityTypesEnum {

}

export interface AbilityModel<T extends AbilityTypesEnum = AbilityTypesEnum> {
    type: T;
}