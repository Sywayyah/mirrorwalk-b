import { CombatActionsRef } from '../api/combat-api';
import { VfxApi } from '../api/vfx-api';
import { Icon } from '../assets';
import { Entity, SpellId } from '../entities';
import { GameObject } from '../game-objects';
import { Hero } from '../heroes';
import { Player } from '../players';
import { EventHandlers } from '../triggers/entity-triggers';
import { DescriptionVariants } from '../ui/descriptions';
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

export const EffectSpellTypes = [SpellActivationType.Buff, SpellActivationType.Debuff];

export const PassiveSpellTypes = [SpellActivationType.Buff, SpellActivationType.Debuff, SpellActivationType.Passive];

export const NonEffectSpellTypes = [
  SpellActivationType.Instant,
  SpellActivationType.Passive,
  SpellActivationType.Target,
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
  descriptions: DescriptionVariants['variants'][];
}

export interface SpellBaseType<SpellStateType = DefaultSpellStateType> extends Entity {
  id: SpellId;
  name: string;

  icon: Icon;

  activationType: SpellActivationType;

  getDescription(data: SpellDescriptionData<SpellStateType>): {
    descriptions: (string | DescriptionVariants['variants'])[];
  };

  config: SpellTypeConfig<SpellStateType>;
}

export enum AISpellTag {
  RegularAttackSpell,
}

export interface SpellTypeConfig<SpellStateType> {
  aiTags?: AISpellTag[];

  // not applicable to passive spells, true by default - might be expanded later
  isOncePerBattle?: boolean;
  // false by default, spell level won't be visible in UI
  hideLevel?: boolean;
  init: (combatRefs: SpellCombatRefsModel<SpellStateType>) => void;
  // if unspecified - always 0
  getManaCost?: (spellInst: Spell<SpellStateType>) => number;

  getTargetActionHint?: (options: {
    spellInstance: Spell<SpellStateType>;
    ownerPlayer?: Player;
    target: UnitGroup;
    ownerHero?: Hero;
    ownerUnit?: UnitGroup;
  }) => string;
  /** Called on ability when it's being acquired or it levels up */
  onAcquired?: (onAquiredConfig: OnSpellAcquiredConfig<SpellStateType>) => void;
  targetCastConfig?: {
    canActivate?: (info: CanActivateSpellParams) => boolean;
  };

  flags?: Partial<{
    isAura: boolean;
  }>;
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
  unitGroup: UnitGroup;
  isEnemy: boolean;
}

export interface OnSpellAcquiredConfig<T> {
  spellInstance: Spell<T>;
  ownerUnit?: UnitGroup;
  ownerHero?: Hero;
}

type SourceInfo = {
  gameObjectId?: string;
  ownerUnitObjectId?: string;
};

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
  // how many rounds it will take for spell to become castable again
  // cooldowns are cleared when battle is over
  cooldown?: number;

  public baseType!: SpellBaseType<T>;

  public sourceInfo!: SourceInfo;

  // may create separate handlers for events outside of combat
  readonly combatEventHandlers = new EventHandlers();

  create({ spellBaseType, initialLevel, state }: SpellCreationParams<T>): void {
    this.baseType = spellBaseType;

    this.currentLevel = initialLevel;
    this.name = this.baseType.name;
    this.state = state;
    this.sourceInfo = {};

    this.updateCurrentManaCost();
  }

  onDestroy(): void {
    this.removeCombatHandlers();
  }

  initCombatHandlers(spellApi: SpellCombatRefsModel<T>): void {
    this.baseType.config.init(spellApi);
  }

  removeCombatHandlers(): void {
    this.combatEventHandlers.removeAllHandlers();
  }

  private updateCurrentManaCost() {
    this.currentManaCost = this.baseType.config.getManaCost?.(this) || 0;
  }

  setCooldown(val: number): void {
    this.cooldown = val;
  }

  clearCooldown(): void {
    this.cooldown = undefined;
  }

  setOwnerObjectId(ownerUnitId: string): void {
    this.sourceInfo.ownerUnitObjectId = ownerUnitId;
  }

  setSourceGameObjectId(sourceGameObjectId: string): void {
    this.sourceInfo.gameObjectId = sourceGameObjectId;
  }

  levelUp(): void {
    this.currentLevel += 1;
    this.updateCurrentManaCost();

    // If spell has ownerUnitId in source info - run onAcquired
    const ownerUnitObjectId = this.sourceInfo.ownerUnitObjectId;
    if (ownerUnitObjectId) {
      this.baseType.config.onAcquired?.({
        spellInstance: this,
        ownerUnit: this.getApi().gameObjects.getObjectByFullId<UnitGroup>(ownerUnitObjectId),
      });
    }
  }

  isEffect(): boolean {
    return isEffectSpell(this as Spell);
  }

  isPassive(): boolean {
    return PassiveSpellTypes.includes(this.baseType.activationType);
  }
}
