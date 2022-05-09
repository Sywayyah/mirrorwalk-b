import { AbilityModel, AbilityTypesEnum } from "../model/abilities.types";
import { UnitTypeModel } from "../model/main.model";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "./unit-types.dictionary";

export const Abilities: Record<AbilityTypesEnum, AbilityModel> = {
    [AbilityTypesEnum.BaseCounterAttack]: {
        type: AbilityTypesEnum.BaseCounterAttack,
    },
};

const setHumanUnitGroupAbility = (unitGroupType: HF_TYPES_ENUM, abilityType: AbilityTypesEnum): [UnitTypeModel, AbilityModel[]] => {
    return [HUMANS_FRACTION_UNIT_TYPES[unitGroupType], [Abilities[abilityType]]]
}

export const BaseAbilitiesTable: Map<UnitTypeModel, AbilityModel[]> = new Map([
    setHumanUnitGroupAbility(HF_TYPES_ENUM.Pikemans, AbilityTypesEnum.BaseCounterAttack),
    // [HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Pikemans], [Abilities[AbilityTypesEnum.BaseCounterAttack]]],
]);