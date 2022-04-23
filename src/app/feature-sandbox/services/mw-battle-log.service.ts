import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum HistoryLogTypesEnum {
  SimpleMsg = 'simple-msg',
  RoundInfoMsg = 'round-info-msg',
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

  public pushMessage(message: HistoryMessageModel): void {
    this.history.push(message);
    this.historyEvent$.next();
  }
}
