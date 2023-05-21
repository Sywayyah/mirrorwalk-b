import { PlayerModel } from 'src/app/core/players';
import { createEventType } from 'src/app/store';
import { props } from "../common";
import { CombatInteractionStateEvent, FightEndsEvent, GroupAttackedEvent, GroupDamagedByGroupEvent, GroupDiesEvent, GroupTakesDamageEvent, NextRoundStarts, PlayerTargetsInstantSpellEvent, PlayerTargetsSpellEvent, PlayerTurnStartEvent, RoundGroupSpendsTurnEvent, UnitHealedEvent, UnitSummonedEvent } from "./types";

const battleEvent = createEventType;

export const PlayerTargetsSpell = battleEvent<PlayerTargetsSpellEvent>('');

export const PlayerCastsInstantSpell = battleEvent<PlayerTargetsInstantSpellEvent>();

export const GroupAttacked = battleEvent<GroupAttackedEvent>();

export const CombatAttackInteraction = battleEvent<CombatInteractionStateEvent>();

export const GroupSpeedChanged = battleEvent<props<'unitGroup'>>();

export const GroupSpellsChanged = battleEvent<props<'unitGroup'>>();

export const GroupModifiersChanged = battleEvent<props<'unitGroup'>>();

export const GroupDamagedByGroup = battleEvent<GroupDamagedByGroupEvent>();

export const GroupTakesDamage = battleEvent<GroupTakesDamageEvent>();

export const UnitSummoned = battleEvent<UnitSummonedEvent>();

export const GroupCounterAttacked = battleEvent<props<'attackingGroup' | 'attackedGroup' | 'loss' | 'damage'>>();

export const GroupDies = battleEvent<GroupDiesEvent>();

export const RoundGroupSpendsTurn = battleEvent<RoundGroupSpendsTurnEvent>();

export const RoundGroupTurnEnds = battleEvent<{ playerEndsTurn: PlayerModel }>();

export const RoundPlayerTurnStarts = battleEvent<PlayerTurnStartEvent>();

export const RoundPlayerCountinuesAttacking = battleEvent();

export const FightNextRoundStarts = battleEvent<NextRoundStarts>();

export const FightEnds = battleEvent<FightEndsEvent>('Fight Ends');

export const UnitHealed = battleEvent<UnitHealedEvent>();
