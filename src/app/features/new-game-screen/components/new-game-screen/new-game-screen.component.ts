import { Component } from '@angular/core';
import { Fraction, Fractions } from 'src/app/core/fractions';
import { neutralsFraction } from 'src/app/core/unit-types/neutrals';
import { GameCreated, GameStart } from 'src/app/features/services/events';
import { EventsService } from 'src/app/store';

const nonPlayableFractions: Fraction<any>[] = [neutralsFraction];

@Component({
  selector: 'mw-new-game-screen',
  templateUrl: './new-game-screen.component.html',
  styleUrls: ['./new-game-screen.component.scss']
})
export class NewGameScreenComponent {
  public playableFractions: Fraction<any>[] = Fractions
    .getAllFractions()
    .filter((fraction) => !nonPlayableFractions.includes(fraction));

  constructor(
    private events: EventsService,
  ) { }

  public startGame(): void {
    this.events.dispatch(GameCreated({}));
  }

  public goToMainScreen(): void {
    this.events.dispatch(GameStart({}));
  }
}
