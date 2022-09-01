import { CanActivateSpellParams } from "../../model/spells";


export const canActivateOnEnemyFn = ({ isEnemy, unitGroup }: CanActivateSpellParams): boolean => {
    return isEnemy;
};

export const canActivateOnAllyFn = ({ isEnemy, unitGroup }: CanActivateSpellParams): boolean => {
    return !isEnemy;
};
