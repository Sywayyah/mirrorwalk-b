import { Injectable } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/players';
import { StructureModel } from 'src/app/core/structures';

/*
  I think I want to have state parts as separated features, maybe don't want to have all
  in one place

  or really only those that must be shared everywhere, like players, settings, etc.
*/
interface Feature {

}

@Injectable({
  providedIn: 'root',
})
export class State {
  public game!: {
    currentPlayer: PlayerInstanceModel;
    neutralPlayer: PlayerInstanceModel;
    structures: StructureModel[];
    currentStructure: StructureModel;
  };

  public settings: {} = {};
}
