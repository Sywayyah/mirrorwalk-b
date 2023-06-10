import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { CombatInteractionEnum } from "./battle";

export interface CommonEventProps {
  unitGroup: UnitGroup;
  player: Player;
  targetPlayer: Player;
  spell: Spell;
  target: UnitGroup;

  attackingPlayer: Player;
  attackedPlayer: Player;

  attackingGroup: UnitGroup;
  attackedGroup: UnitGroup;

  action: CombatInteractionEnum;

  loss: number;
  damage: number;
}

export type props<K extends keyof CommonEventProps> = Pick<CommonEventProps, K>;
