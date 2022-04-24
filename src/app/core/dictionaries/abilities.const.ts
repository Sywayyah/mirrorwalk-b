import { AbilityModel, AbilityTypesEnum } from "../model/abilities.types";

export const Abilities: Record<AbilityTypesEnum, AbilityModel> = {
    [AbilityTypesEnum.BaseCounterAttack]: {
        type: AbilityTypesEnum.BaseCounterAttack,
    },
};