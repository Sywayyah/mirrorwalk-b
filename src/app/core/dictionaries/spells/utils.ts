import { CanActivateSpellParams } from "../../model/spells";
import { Colors } from "../colors.const";


export const canActivateOnEnemyFn = ({ isEnemy, unitGroup }: CanActivateSpellParams): boolean => {
  return isEnemy && unitGroup.fightInfo.isAlive;
};

export const canActivateOnAllyFn = ({ isEnemy, unitGroup }: CanActivateSpellParams): boolean => {
  return !isEnemy;
};

export const debuffColors = {
  bgClr: Colors.DefautlDebuffBg,
  iconClr: Colors.DefautlDebuffClr,
};

export const buffColors = {
  bgClr: Colors.DefautlBuffBg,
  iconClr: Colors.DefautlBuffClr,
};
