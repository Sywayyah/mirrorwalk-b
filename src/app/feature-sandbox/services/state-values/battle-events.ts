import { PlayerModel } from "src/app/core/model/main.model";
import { StructureModel } from "src/app/core/model/structures.types";
import { eventsForPrefix } from "../state";
// import { GroupDamagedByGroupEvent, GroupDiesEvent, GroupTakesDamageEvent } from "../types";
import { CombatInteractionStateEvent, FightEndsEvent, GroupAttackedEvent, GroupDamagedByGroupEvent, GroupDiesEvent, GroupTakesDamageEvent, NextRoundStarts as NextRoundStartsEvent, PlayerTargetsInstantSpellEvent, PlayerTargetsSpellEvent, PlayerTurnStartEvent, props, RoundGroupSpendsTurnEvent } from "./battle.types";

const battleEvent = eventsForPrefix('[Battle]');

export const PlayerTargetsSpell = battleEvent<PlayerTargetsSpellEvent>('');

export const PlayerCastsInstantSpell = battleEvent<PlayerTargetsInstantSpellEvent>();

export const GroupAttacked = battleEvent<GroupAttackedEvent>();

export const CombatAttackInteraction = battleEvent<CombatInteractionStateEvent>();

export const GroupSpeedChanged = battleEvent<props<'unitGroup'>>();

export const GroupSpellsChanged = battleEvent<props<'unitGroup'>>();

export const GroupModifiersChanged = battleEvent<props<'unitGroup'>>();

export const GroupDamagedByGroup = battleEvent<GroupDamagedByGroupEvent>();

export const GroupTakesDamage = battleEvent<GroupTakesDamageEvent>();

export const GroupCounterAttacked = battleEvent<props<'attackingGroup' | 'attackedGroup' | 'loss' | 'damage'>>();

export const GroupDies = battleEvent<GroupDiesEvent>();

export const RoundGroupSpendsTurn = battleEvent<RoundGroupSpendsTurnEvent>();

export const RoundGroupTurnEnds = battleEvent<{ playerEndsTurn: PlayerModel }>();

export const RoundPlayerTurnStarts = battleEvent<PlayerTurnStartEvent>();

export const RoundPlayerCountinuesAttacking = battleEvent();

export const FightNextRoundStarts = battleEvent<NextRoundStartsEvent>();

export const FightEnds = battleEvent<FightEndsEvent>();
