import { PlayerInstanceModel, PlayerModel } from 'src/app/core/players';
import { SpellInstance } from 'src/app/core/spells';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { CombatInteractionEnum } from "./battle";

export interface CommonEventProps {
  unitGroup: UnitGroupInstModel;
  player: PlayerInstanceModel;
  targetPlayer: PlayerModel;
  spell: SpellInstance;
  target: UnitGroupInstModel;

  attackingPlayer: PlayerInstanceModel;
  attackedPlayer: PlayerInstanceModel;

  attackingGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;

  action: CombatInteractionEnum;

  loss: number;
  damage: number;
}

export type props<K extends keyof CommonEventProps> = Pick<CommonEventProps, K>;
