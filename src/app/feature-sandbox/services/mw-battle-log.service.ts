import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerModel } from 'src/app/core/model/main.model';
import {
  HistoryMessageModel,
  SimpleMessage,
  HistoryLogTypesEnum,
  RoundInfoMessage,
  DealtDamageMessage,
  BattleEventTypeEnum,
} from './types';
import { BattleEventsService } from './mw-battle-events.service';

@Injectable({
  providedIn: 'root'
})
export class MwBattleLogService {

  public history: HistoryMessageModel[] = [];
  public historyEvent$: Subject<void> = new Subject();

  constructor(
    private readonly battleEvents: BattleEventsService,
  ) {
    this.battleEvents.onEvents({
      [BattleEventTypeEnum.On_Group_Damaged]: event => this.logDealtDamageMessage({
        attacked: event.attackedGroup.type,
        attackedPlayer: event.attackedGroup.ownerPlayerRef as PlayerModel,
        attacker: event.attackerGroup.type,
        attackingPlayer: event.attackerGroup.ownerPlayerRef as PlayerModel,
        damage: event.damage,
        losses: event.loss,
      }),
      [BattleEventTypeEnum.On_Group_Counter_Attacked]: event => this.logSimpleMessage(`${event.attackerGroup.type.name} (${event.attackerGroup.count}) counterattacks, dealing ${event.damage} damage, killing ${event.loss} units`),
      [BattleEventTypeEnum.On_Group_Dies]: event => this.logSimpleMessage(`Group of ${event.target.type.name} dies, losing ${event.loss} units`),


      [BattleEventTypeEnum.Round_Player_Turn_Starts]: event => this.logRoundInfoMessage(`Player ${event.currentPlayer.type} starts his turn`),

      [BattleEventTypeEnum.Fight_Ends]: event => this.logRoundInfoMessage(event.win ? 'Win!' : 'Defeat'),
      [BattleEventTypeEnum.Fight_Next_Round_Starts]: event => this.logRoundInfoMessage(`Round ${event.round} starts`),
    }).subscribe();
  }

  public logSimpleMessage(log: string): void {
    const simpleMessage: SimpleMessage = { type: HistoryLogTypesEnum.SimpleMsg, message: log };
    this.pushMessage(simpleMessage);
  }

  public logRoundInfoMessage(msg: string): void {
    const roundInfoMessage: RoundInfoMessage = { type: HistoryLogTypesEnum.RoundInfoMsg, message: msg };
    this.pushMessage(roundInfoMessage);
  }

  public logDealtDamageMessage(info: Omit<DealtDamageMessage, 'type'>): void {
    const dealtDamageLog: DealtDamageMessage = {
      type: HistoryLogTypesEnum.DealtDamageMsg,
      ...info,
    };

    this.pushMessage(dealtDamageLog);
  }

  public pushMessage(message: HistoryMessageModel): void {
    this.history.push(message);
    this.historyEvent$.next();
  }
}
