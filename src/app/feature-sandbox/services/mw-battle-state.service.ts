import { Injectable } from '@angular/core';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root',
})
export class BattleStateService {
  
  private initialUnitGroups!: UnitGroupModel[];
  private fightQueue!: UnitGroupModel[];
  private players!: PlayerModel[];

  

  constructor() {}


  /* until turns are out. */
  public initBattle(
    unitGroups: UnitGroupModel[],
    players: PlayerModel[],
  ): void {
    this.initialUnitGroups = unitGroups;

    this.players = players;

    this.fightQueue = this.initialUnitGroups.sort((a, b) => {
      return b.type.speed - a.type.speed;
    });
  }

  public getFightQueue(): UnitGroupModel[] {
    return this.fightQueue;
  }

}
