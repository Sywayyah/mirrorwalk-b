import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BattleEventsService } from './mw-battle-events.service';
import {
  BattleEventTypeEnum, DealtDamageMessage, HistoryLogTypesEnum, HistoryLogModel, RoundInfoMessage, SimpleMessage
} from './types';

@Injectable({
  providedIn: 'root'
})
export class MwBattleLogService {

  public history: HistoryLogModel[] = [];
  public historyEvent$: Subject<void> = new Subject();

  constructor(
    private readonly battleEvents: BattleEventsService,
  ) {
    this.battleEvents.onEvents({
      [BattleEventTypeEnum.Fight_Starts]: () => {
        this.history = [];
      },

      [BattleEventTypeEnum.On_Group_Damaged_By_Group]: event => this.logDealtDamageMessage({
        attacked: event.attackedGroup.type,
        attackedPlayer: event.attackedGroup.ownerPlayerRef,
        attacker: event.attackerGroup.type,
        attackingPlayer: event.attackerGroup.ownerPlayerRef,
        damage: event.damage,
        losses: event.loss,
      }),
      [BattleEventTypeEnum.On_Group_Counter_Attacked]: event => this.logSimpleMessage(`${event.attackerGroup.type.name} (${event.attackerGroup.count}) counterattacks, dealing ${event.damage} damage, ${event.loss} units perish`),
      [BattleEventTypeEnum.On_Group_Dies]: event => this.logSimpleMessage(`Group of ${event.target.type.name} dies, losing ${event.loss} units`),

      /* todo: timely, logs will be controlled from spell's code */
      [BattleEventTypeEnum.Player_Targets_Spell]: event => {
        switch (event.spell.type.activationType) {
          case 'target':
            // this.logSimpleMessage(`${event.player.hero.name} casts ${event.spell.name} against ${event.target.count} ${event.target.type.name}`);
            break;
        }
        
      },

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

  public pushMessage(message: HistoryLogModel): void {
    this.history.push(message);
    this.historyEvent$.next();
  }
}
