import { CombatActionsRef } from "../combat-api/combat-api.types";
import { HeroInstanceModel } from "../hero.model";
import { Icon } from "../icons.types";
import { ItemInstanceModel } from "../items/items.types";
import type { PlayerInstanceModel, UnitGroupInstModel } from "../main.model";
import { VfxApi } from "../vfx-api/vfx-api.types";
import type { SpellEventHandlers } from "./spell-events";

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
  ownerHero: HeroInstanceModel;
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

