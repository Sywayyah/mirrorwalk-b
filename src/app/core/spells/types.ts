import { CombatActionsRef } from '../api/combat-api';
import { VfxApi } from '../api/vfx-api';
import { Icon } from '../assets';
import { GameObject } from '../game-objects';
import { Hero } from '../heroes';
import { Item } from '../items';
import { Player } from '../players';
import { DescriptionElement } from '../ui/descriptions';
import { UnitGroup } from '../unit-types';
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

export const EffectSpellTypes = [
  SpellActivationType.Buff,
  SpellActivationType.Debuff,
];

export const PassiveSpellTypes = [
  SpellActivationType.Buff,
  SpellActivationType.Debuff,
  SpellActivationType.Passive,
];

export const NonEffectSpellTypes = [
  SpellActivationType.Instant,
  SpellActivationType.Passive,
  SpellActivationType.Target
];

export function isEffectSpell(spell: Spell): boolean {
  return EffectSpellTypes.includes(spell.baseType.activationType);
}

export type DefaultSpellStateType = unknown;

export interface SpellDescriptionData<SpellStateType = DefaultSpellStateType> {
  thisSpell: SpellBaseType<SpellStateType>;
  spellInstance: Spell<SpellStateType>;
  ownerPlayer: Player;
  ownerUnit?: UnitGroup;
  ownerHero: Hero;
}

export interface SpellDescription {
  descriptions: DescriptionElement[]
}

export interface SpellBaseType<SpellStateType = DefaultSpellStateType> {
  name: string;
  // level: number;
  activationType: SpellActivationType;

  getDescription(data: SpellDescriptionData<SpellStateType>): { descriptions: DescriptionElement[] };

  type: SpellTypeConfig<SpellStateType>;

  icon: Icon;
}

export interface SpellTypeConfig<SpellStateType> {
  spellConfig: SpellConfig<SpellStateType>;
  spellInfo: { name: string; };
}

export interface SpellCombatEventsRef {
  on: (handlers: SpellEventHandlers) => void;
}

export interface SpellCombatRefsModel<SpellStateType> {
  events: SpellCombatEventsRef;
  actions: CombatActionsRef;
  thisSpell: SpellBaseType<SpellStateType>;
  spellInstance: Spell<SpellStateType>;
  ownerPlayer: Player;
  ownerUnit?: UnitGroup;
  ownerHero: Hero;
  vfx: VfxApi;
}

export interface CanActivateSpellParams {
  unitGroup: UnitGroup,
  isEnemy: boolean,
}

export interface SpellConfig<SpellStateType> {
  init: (combatRefs: SpellCombatRefsModel<SpellStateType>) => void;
  getManaCost: (spellInst: Spell<SpellStateType>) => number;
  targetCastConfig?: {
    canActivate?: (info: CanActivateSpellParams) => boolean,
  };
}

export interface SpellCreationParams<T> {
  spellBaseType: SpellBaseType<T>;
  initialLevel: number;
  state?: T;
}

export class Spell<T = DefaultSpellStateType> extends GameObject<SpellCreationParams<T>> {
  public static readonly categoryId: string = 'spell';

  public name!: string;

  public state?: T;
  public currentLevel: number = 1;
  public currentManaCost!: number;
  // cooldown: number;

  public baseType!: SpellBaseType<T>;

  public sourceInfo!: {
    gameObjectId?: string;
  };

  create({ spellBaseType, initialLevel, state }: SpellCreationParams<T>): void {
    this.baseType = spellBaseType;

    this.currentLevel = initialLevel;
    this.name = this.baseType.type.spellInfo.name;
    this.state = state;
    this.sourceInfo = {};

    this.currentManaCost = this.baseType.type.spellConfig.getManaCost(this);
  }

  levelUp(): void {
    this.currentLevel += 1;
    this.currentManaCost = this.baseType.type.spellConfig.getManaCost(this);
  }

  isEffect(): boolean {
    return isEffectSpell(this as Spell);
  }

  isPassive(): boolean {
    return PassiveSpellTypes.includes(this.baseType.activationType);
  }
}

