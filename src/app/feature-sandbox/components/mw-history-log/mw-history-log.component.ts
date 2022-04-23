import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MwBattleLogService, HistoryLogTypesEnum } from 'src/app/feature-sandbox/services';

@Component({
  selector: 'mw-history-log',
  templateUrl: './mw-history-log.component.html',
  styleUrls: ['./mw-history-log.component.scss']
})
export class MwHistoryLogComponent implements OnInit {
  @ViewChild('historyLog', { static: true }) public historyLogElem!: ElementRef;

  public types: typeof HistoryLogTypesEnum = HistoryLogTypesEnum;

  constructor(
    public readonly battleLogService: MwBattleLogService,
  ) { }

  ngOnInit(): void {
    this.battleLogService.historyEvent$.subscribe(() => {
      const historyElem = this.historyLogElem.nativeElement;
      setTimeout(() => {
        historyElem.scrollTo({ top: historyElem.scrollHeight, behavior: 'smooth' });
      }, 0);
    });
  }

}
