import { Component, OnInit } from '@angular/core';
import { BattleEventModel, BattleStateService } from '../../services';
import { ActionHintTypeEnum } from '../../services/types/action-hint.types';

@Component({
  selector: 'mw-action-hint',
  templateUrl: './mw-action-hint.component.html',
  styleUrls: ['./mw-action-hint.component.scss']
})
export class MwActionHintComponent implements OnInit {

  public hintActionTypes: typeof ActionHintTypeEnum = ActionHintTypeEnum;
  public actionHint: BattleEventModel | null = null;

  constructor(
    public readonly mwBattleState: BattleStateService,
  ) {
  }

  ngOnInit(): void {
  }
}
