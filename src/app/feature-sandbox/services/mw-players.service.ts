import { Injectable } from '@angular/core';
import { PlayerModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root'
})
export class MwPlayersService {
  public players: Map<string, PlayerModel> = new Map();

  constructor() { }
}
