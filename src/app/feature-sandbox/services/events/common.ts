import { UnitGroupInstModel, PlayerInstanceModel, PlayerModel, SpellInstance } from "src/app/core/model";
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
