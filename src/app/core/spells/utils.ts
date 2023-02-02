import { CombatActionsRef, PostDamageInfo } from '../api/combat-api';
import { VfxApi } from '../api/vfx-api';
import { Colors } from '../assets';
import { Hero } from '../heroes';
import { UnitBase, UnitGroupInstModel } from '../unit-types';
import { getDamageParts } from '../vfx';
import { CanActivateSpellParams, SpellInstance, SpellModel } from './types';

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

export const logDamage = ({
  actionInfo,
  actions,
  ownerHero,
  targetUnit,
  thisSpell,
  vfx
}: { actionInfo: PostDamageInfo, ownerHero: Hero, targetUnit: UnitGroupInstModel, thisSpell: SpellModel, actions: CombatActionsRef, vfx: VfxApi }) => {
  actions.historyLog(`${ownerHero.name} deals ${actionInfo.finalDamage} damage to ${targetUnit.type.name} with ${thisSpell.name}`)

  vfx.createFloatingMessageForUnitGroup(
    targetUnit,
    getDamageParts(actionInfo.finalDamage, actionInfo.unitLoss),
    { duration: 1000 },
  );
};
