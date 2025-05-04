import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { Variantable } from '../utils';

export enum ActionHintTypeEnum {
  OnHoverEnemyCard = 'on-hover-enemy-card',
  OnTargetSpell = 'on-target-spell',
  CustomHtml = 'custom-html',
}

export type ActionHintVariants = Variantable<
  ActionHintTypeEnum,
  {
    [ActionHintTypeEnum.CustomHtml]: {
      html: string;
    };
    [ActionHintTypeEnum.OnHoverEnemyCard]: {
      attackedGroup: UnitGroup;
      minDamage: number;
      maxDamage: number;
      minCountLoss: number;
      maxCountLoss: number;
      noDamageSpread: boolean;
      noLossSpread: boolean;
      attackSuperiority: number;
    };
    [ActionHintTypeEnum.OnTargetSpell]: {
      spell: Spell;
      target: UnitGroup;
      addedContent?: string;
    };
  }
>;
