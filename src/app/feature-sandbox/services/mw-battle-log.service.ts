import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerModel, UnitGroupModel, UnitTypeModel } from 'src/app/core/model/main.model';

export enum HistoryLogTypesEnum {
  SimpleMsg = 'simple-msg',
  RoundInfoMsg = 'round-info-msg',
  DealtDamageMsg = 'dealt-damage-msg',
}

export interface HistoryMessageModel {
  type: HistoryLogTypesEnum;
}

export interface SimpleMessage extends HistoryMessageModel {
  type: HistoryLogTypesEnum.SimpleMsg;
  message: string;
}

export interface RoundInfoMessage extends HistoryMessageModel {
  type: HistoryLogTypesEnum.RoundInfoMsg;
  message: string;
}

export interface DealtDamageMessage extends HistoryMessageModel {
  type: HistoryLogTypesEnum.DealtDamageMsg;
  attackingPlayer: PlayerModel;
  attackedPlayer: PlayerModel;
  attacker: UnitTypeModel;
  attacked: UnitTypeModel;
  losses: number;
  damage: number;
}


@Injectable({
  providedIn: 'root'
})
export class MwBattleLogService {

  public history: HistoryMessageModel[] = [];
  public historyEvent$: Subject<void> = new Subject();

  constructor() { }

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
