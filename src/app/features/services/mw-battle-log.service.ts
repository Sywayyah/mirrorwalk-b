import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  DealtDamageMessage,
  HistoryLogModel,
  HistoryLogTypesEnum,
  HtmlMessage,
  RoundInfoMessage,
  SimpleMessage,
} from 'src/app/core/ui';

@Injectable({
  providedIn: 'root',
})
export class MwBattleLogService {
  history: HistoryLogModel[] = [];
  readonly historyEvent$: Subject<void> = new Subject();

  public logHtmlMessage(htmlMsg: string): void {
    const htmlMessage: HtmlMessage = { type: HistoryLogTypesEnum.Html, message: htmlMsg };
    this.pushMessage(htmlMessage);
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
