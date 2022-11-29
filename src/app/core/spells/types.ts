import { CombatActionsRef } from '../api/combat-api';
import { VfxApi } from '../api/vfx-api';
import { Icon } from '../assets';
import { Hero } from '../heroes';
import { ItemInstanceModel } from '../items';
import { PlayerInstanceModel } from '../players';
import { UnitGroupInstModel } from '../unit-types';
import { SpellEventHandlers } from './spell-events';

export enum SpellActivationType {
  Target = 'target',
  Instant = 'instant',
  Passive = 'passive',

  //  special type of ability, can be added to the unit group for some
  // continuous effect. When unit group dies, debuff gets removed and unregistered.
  Debuff = 'debuff',
  Buff = 'buff',
}

/* Spell model */

export type DefaultSpellStateType = unknown;

export interface SpellModel<SpellStateType = DefaultSpellStateType> {
  name: string;
  // level: number;
  activationType: SpellActivationType;

  description?: string;

  type: SpellTypeModel<SpellStateType>;

  icon: Icon;
}

export interface SpellInstance<T = DefaultSpellStateType> {
  name: string;
  description: string;

  state: T | null;
  currentLevel: number;
  currentManaCost: number;
  // cooldown: number;


  baseType: SpellModel<T>;

  sourceInfo: {
    item?: ItemInstanceModel,
  };
}

export interface SpellTypeModel<SpellStateType> {
  spellConfig: SpellConfig<SpellStateType>;
  spellInfo: { name: string; };
}

export interface SpellCombatEventsRef {
  on: (handlers: SpellEventHandlers) => void;
}

export interface SpellCombatRefsModel<SpellStateType> {
  events: SpellCombatEventsRef;
  actions: CombatActionsRef;
  thisSpell: SpellModel<SpellStateType>;
  spellInstance: SpellInstance<SpellStateType>;
  ownerPlayer: PlayerInstanceModel;
  ownerUnit?: UnitGroupInstModel;
  ownerHero: Hero;
  vfx: VfxApi;
}

export interface CanActivateSpellParams {
  unitGroup: UnitGroupInstModel,
  isEnemy: boolean,
}

export interface SpellConfig<SpellStateType> {
  init: (combatRefs: SpellCombatRefsModel<SpellStateType>) => void;
  getManaCost: (spellInst: SpellInstance<SpellStateType>) => number;
  targetCastConfig?: {
    canActivate?: (info: CanActivateSpellParams) => boolean,
  };
}

