import { CanActivateSpellParams } from "../../model/spells";


export const canActivateOnEnemyFn = ({ isEnemy, unitGroup }: CanActivateSpellParams): boolean => {
    return isEnemy;
};
