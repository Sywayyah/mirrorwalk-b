import { Component, ElementRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HistoryLogTypesEnum } from 'src/app/core/ui';
import { MwBattleLogService } from 'src/app/features/services';

@Component({
    selector: 'mw-history-log',
    templateUrl: './mw-history-log.component.html',
    styleUrls: ['./mw-history-log.component.scss'],
    standalone: false
})
export class MwHistoryLogComponent {
  @ViewChild('historyLog', { static: true }) public historyLogElem!: ElementRef;

  public types: typeof HistoryLogTypesEnum = HistoryLogTypesEnum;

  constructor(
    public readonly battleLogService: MwBattleLogService,
  ) {
    this.battleLogService.historyEvent$.pipe(
      takeUntilDestroyed(),
    ).subscribe(() => {
      const historyElem = this.historyLogElem.nativeElement;
      setTimeout(() => {
        historyElem.scrollTo({ top: historyElem.scrollHeight, behavior: 'smooth' });
      }, 0);
    });
  }
}
