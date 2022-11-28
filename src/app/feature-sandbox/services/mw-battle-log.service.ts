import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DealtDamageMessage, HistoryLogModel, HistoryLogTypesEnum, RoundInfoMessage, SimpleMessage } from 'src/app/core/ui';

@Injectable({
  providedIn: 'root'
})
export class MwBattleLogService {

  public history: HistoryLogModel[] = [];
  public historyEvent$: Subject<void> = new Subject();

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
