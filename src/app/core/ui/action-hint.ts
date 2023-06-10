import { SafeHtml } from '@angular/platform-browser';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';

export enum ActionHintTypeEnum {
  OnHoverEnemyCard = 'on-hover-enemy-card',
  OnTargetSpell = 'on-target-spell',
  CustomHtml = 'custom-html',
}

export interface ActionHintModel<T extends ActionHintTypeEnum = ActionHintTypeEnum> {
  type: T;
}

export interface CustomHtmlActionHint extends ActionHintModel<ActionHintTypeEnum.CustomHtml> {
  html: string;
  safeHtml: SafeHtml;
}

export interface AttackActionHintInfo extends ActionHintModel<ActionHintTypeEnum.OnHoverEnemyCard> {
  attackedGroup: UnitGroup;
  minDamage: number;
  maxDamage: number;
  minCountLoss: number;
  maxCountLoss: number;
  noDamageSpread: boolean;
  noLossSpread: boolean;
  attackSuperiority: number;
}

export interface SpellTargetActionHint extends ActionHintModel<ActionHintTypeEnum.OnTargetSpell> {
  spell: Spell;
  target: UnitGroup;
}

