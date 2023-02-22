import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HistoryLogTypesEnum } from 'src/app/core/ui';
import { MwBattleLogService } from 'src/app/features/services';

@Component({
  selector: 'mw-history-log',
  templateUrl: './mw-history-log.component.html',
  styleUrls: ['./mw-history-log.component.scss']
})
export class MwHistoryLogComponent implements OnInit, OnDestroy {
  @ViewChild('historyLog', { static: true }) public historyLogElem!: ElementRef;

  public types: typeof HistoryLogTypesEnum = HistoryLogTypesEnum;

  private destroyed$ = new Subject<void>();

  constructor(
    public readonly battleLogService: MwBattleLogService,
  ) { }

  public ngOnInit(): void {
    this.battleLogService.historyEvent$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      const historyElem = this.historyLogElem.nativeElement;
      setTimeout(() => {
        historyElem.scrollTo({ top: historyElem.scrollHeight, behavior: 'smooth' });
      }, 0);
    });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
