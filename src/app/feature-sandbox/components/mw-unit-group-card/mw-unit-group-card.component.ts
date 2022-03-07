import { Component, Input, OnInit } from '@angular/core';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';

@Component({
  selector: 'mw-mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss']
})
export class MwUnitGroupCardComponent implements OnInit {

  @Input()
  public unitGroup!: UnitGroupModel;
  @Input()
  public playerInfo!: PlayerModel;

  constructor() { }

  ngOnInit(): void {
  }

}
